import { useFocusEffect } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TFunction } from 'i18next'
import React, { ReactElement, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useAppDispatch, useAppTheme } from 'src/app/hooks'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import ImportIcon from 'src/assets/icons/arrow-rightwards-down.svg'
import EyeIcon from 'src/assets/icons/eye.svg'
import SeedPhraseIcon from 'src/assets/icons/pencil.svg'
import { BackButton } from 'src/components/buttons/BackButton'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { Box, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { isICloudAvailable } from 'src/features/CloudBackup/RNICloudBackupsManager'
import { importAccountActions } from 'src/features/import/importAccountSaga'
import { ImportAccountType } from 'src/features/import/types'
import { OnboardingScreen } from 'src/features/onboarding/OnboardingScreen'
import { ImportType, OnboardingEntryPoint } from 'src/features/onboarding/utils'
import { ElementName } from 'src/features/telemetry/constants'
import { Account, AccountType } from 'src/features/wallet/accounts/types'
import { createAccountActions } from 'src/features/wallet/createAccountSaga'
import { useAccounts, usePendingAccounts } from 'src/features/wallet/hooks'
import {
  PendingAccountActions,
  pendingAccountActions,
} from 'src/features/wallet/pendingAcccountsSaga'
import { OnboardingScreens } from 'src/screens/Screens'
import { Theme } from 'src/styles/theme'
import { openSettings } from 'src/utils/linking'

interface ImportMethodOption {
  title: (t: TFunction) => string
  blurb: (t: TFunction) => string
  icon: (theme: Theme) => React.ReactNode
  nav: OnboardingScreens
  importType: ImportType
  name: ElementName
}

const options: ImportMethodOption[] = [
  {
    title: (t: TFunction) => t('Create a new wallet'),
    blurb: (t: TFunction) => t('Start fresh with a new recovery phrase'),
    icon: (theme: Theme) => (
      <SeedPhraseIcon color={theme.colors.textPrimary} height={22} strokeWidth="1.5" width={22} />
    ),
    nav: OnboardingScreens.EditName,
    importType: ImportType.CreateNew,
    name: ElementName.OnboardingCreateWallet,
  },
  {
    title: (t: TFunction) => t('Import an existing wallet'),
    blurb: (t: TFunction) => t('Enter your recovery phrase'),
    icon: (theme: Theme) => (
      <ImportIcon color={theme.colors.textPrimary} height={18} strokeWidth="1.5" width={18} />
    ),
    nav: OnboardingScreens.SeedPhraseInput,
    importType: ImportType.SeedPhrase,
    name: ElementName.OnboardingImportSeedPhrase,
  },
  {
    title: (t: TFunction) => t('Add a view-only wallet'),
    blurb: (t: TFunction) => t('Explore the contents of any wallet'),
    icon: (theme: Theme) => (
      <EyeIcon color={theme.colors.textPrimary} height={20} strokeWidth="1.5" width={20} />
    ),
    nav: OnboardingScreens.WatchWallet,
    importType: ImportType.Watch,
    name: ElementName.OnboardingImportWatchedAccount,
  },
]

type Props = NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.ImportMethod>

export function ImportMethodScreen({ navigation, route: { params } }: Props): ReactElement {
  const { t } = useTranslation()
  const theme = useAppTheme()
  const dispatch = useAppDispatch()
  const entryPoint = params?.entryPoint

  const accounts = useAccounts()
  const pendingAccounts = usePendingAccounts()
  const initialViewOnlyWallets = useRef<Account[]>( // Hold onto reference of view-only wallets before importing more wallets
    Object.values(accounts).filter((a) => a.type === AccountType.Readonly)
  )

  useFocusEffect(() => {
    if (params?.importType !== ImportType.SeedPhrase) return

    /**
     * When we go back and exit onboarding, we re-add any initial view-only wallets
     * that were overwritten during the import flow. (Due to how our redux account store is setup,
     * with the key being the address, when the mnemonic version of the wallet is imported,
     * it overwrites the view-only wallet.)
     */

    const unmodifiedWalletCleanup = (): void => {
      if (!initialViewOnlyWallets.current) return
      const pendingAccountAddresses = Object.keys(pendingAccounts)
      for (const viewOnlyWallet of initialViewOnlyWallets.current) {
        if (pendingAccountAddresses.includes(viewOnlyWallet.address)) {
          dispatch(
            importAccountActions.trigger({
              type: ImportAccountType.Address,
              address: viewOnlyWallet.address,
            })
          )
          dispatch(pendingAccountActions.trigger(PendingAccountActions.ACTIVATE))
        }
      }
    }
    navigation.addListener('beforeRemove', unmodifiedWalletCleanup)
    return () => navigation.removeListener('beforeRemove', unmodifiedWalletCleanup)
  })

  useEffect(() => {
    const shouldRenderBackButton = navigation.getState().index === 0
    if (shouldRenderBackButton) {
      navigation.setOptions({
        headerLeft: () => <BackButton />,
      })
    }
  }, [navigation, theme.colors.textPrimary])

  const handleOnPressRestoreBackup = async (): Promise<void> => {
    const iCloudAvailable = await isICloudAvailable()

    if (!iCloudAvailable) {
      Alert.alert(
        t('iCloud Drive not available'),
        t(
          'Please verify that you are logged in to an Apple ID with iCloud Drive enabled on this device and try again.'
        ),
        [
          { text: t('Go to settings'), onPress: openSettings, style: 'default' },
          { text: t('Not now'), style: 'cancel' },
        ]
      )
      return
    }

    navigation.navigate({
      name: OnboardingScreens.RestoreCloudBackupLoading,
      params: { importType: ImportType.Restore, entryPoint },
      merge: true,
    })
  }

  const handleOnPress = (nav: OnboardingScreens, importType: ImportType): void => {
    // Delete any pending accounts before entering flow.
    dispatch(pendingAccountActions.trigger(PendingAccountActions.DELETE))
    if (importType === ImportType.CreateNew) {
      dispatch(createAccountActions.trigger())
    }

    if (importType === ImportType.Restore) {
      handleOnPressRestoreBackup()
      return
    }

    navigation.navigate({
      name: nav,
      params: { importType, entryPoint },
      merge: true,
    })
  }

  const importOptions =
    entryPoint === OnboardingEntryPoint.Sidebar
      ? options.filter((option) => option.name !== ElementName.OnboardingImportWatchedAccount)
      : options

  return (
    <OnboardingScreen title={t('How do you want to get started?')}>
      <Flex grow gap="sm">
        {importOptions.map(({ title, blurb, icon, nav, importType, name }) => (
          <OptionCard
            key={'connection-option-' + title}
            blurb={blurb(t)}
            icon={icon(theme)}
            name={name}
            title={title(t)}
            onPress={(): void => handleOnPress(nav, importType)}
          />
        ))}
      </Flex>
      <Flex alignItems="center" mb="sm">
        <Text
          color="accentAction"
          variant="buttonLabelMedium"
          onPress={(): void =>
            handleOnPress(OnboardingScreens.RestoreCloudBackup, ImportType.Restore)
          }>
          Restore from iCloud
        </Text>
      </Flex>
    </OnboardingScreen>
  )
}

function OptionCard({
  title,
  blurb,
  icon,
  onPress,
  name,
  disabled,
  opacity,
}: {
  title: string
  blurb: string
  icon: React.ReactNode
  onPress: () => void
  name: ElementName
  disabled?: boolean
  opacity?: number
}): ReactElement {
  return (
    <TouchableArea
      backgroundColor="background2"
      borderColor="backgroundOutline"
      borderRadius="lg"
      borderWidth={1}
      disabled={disabled}
      name={name}
      opacity={opacity}
      px="md"
      py="lg"
      testID={name}
      onPress={onPress}>
      <Flex row alignContent="center" alignItems="center" gap="md">
        <Box
          alignItems="center"
          borderColor="accentBranded"
          borderRadius="md"
          borderWidth={1.25}
          height={40}
          justifyContent="center"
          padding="md"
          width={40}>
          {icon}
        </Box>
        <Flex row alignItems="center" gap="xxs">
          <Flex fill alignItems="flex-start" gap="xxs" justifyContent="space-around">
            <Text allowFontScaling={false} variant="subheadLarge">
              {title}
            </Text>
            <Text allowFontScaling={false} color="textSecondary" variant="bodySmall">
              {blurb}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
