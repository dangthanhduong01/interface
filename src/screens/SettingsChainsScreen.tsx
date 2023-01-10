import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useAppDispatch } from 'src/app/hooks'
import { Switch } from 'src/components/buttons/Switch'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Box } from 'src/components/layout/Box'
import { SheetScreen } from 'src/components/layout/SheetScreen'
import { Text } from 'src/components/Text'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO } from 'src/constants/chains'
import { setChainActiveStatus } from 'src/features/chains/chainsSlice'
import { useActiveChainIds } from 'src/features/chains/utils'
import { flex } from 'src/styles/flex'
import { theme } from 'src/styles/theme'

export function SettingsChainsScreen(): ReactElement {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const activeChains = useActiveChainIds()

  return (
    <SheetScreen pt="lg" px="lg">
      <ScrollView contentContainerStyle={{ ...flex.fill, paddingTop: theme.spacing.xxl }}>
        <BackHeader alignment="left" mb="lg">
          <Text variant="subheadLarge">{t('Chain Settings')}</Text>
        </BackHeader>
        <Box px="sm">
          <Text variant="subheadLarge">{t('Configure active chains (networks)')}</Text>
          {ALL_SUPPORTED_CHAIN_IDS.map((chainId) => {
            const isActive = activeChains.includes(chainId)
            return (
              <Box
                key={chainId}
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                mt="lg">
                <Text variant="bodyLarge">{CHAIN_INFO[chainId].label}</Text>
                <Switch
                  value={isActive}
                  onValueChange={(newValue: boolean): void => {
                    dispatch(setChainActiveStatus({ chainId, isActive: newValue }))
                  }}
                />
              </Box>
            )
          })}
        </Box>
      </ScrollView>
    </SheetScreen>
  )
}
