import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'
import { useAppSelector, useAppTheme } from 'src/app/hooks'
import { AccountDrawer } from 'src/app/navigation/AccountDrawer'
import { TabBar } from 'src/app/navigation/TabBar'
import {
  AccountStackParamList,
  AppStackParamList,
  OnboardingStackParamList,
  SettingsStackParamList,
  TabParamList,
} from 'src/app/navigation/types'
import { selectFinishedOnboarding } from 'src/features/wallet/walletSlice'
import { CurrencySelectorScreen } from 'src/screens/CurrencySelectorScreen'
import { DevScreen } from 'src/screens/DevScreen'
import { EducationScreen } from 'src/screens/EducationScreen'
import { ExploreScreen } from 'src/screens/ExploreScreen'
import { ImportAccountScreen } from 'src/screens/ImportAccountScreen'
import { LedgerScreen } from 'src/screens/LedgerScreen'
import { NFTCollectionScreen } from 'src/screens/NFTCollectionScreen'
import { NFTScreen } from 'src/screens/NFTScreen'
import { NotificationsScreen } from 'src/screens/NotificationsScreen'
import { BackupScreen } from 'src/screens/Onboarding/BackupScreen'
import { CloudBackupProcessingScreen } from 'src/screens/Onboarding/CloudBackupProcessingScreen'
import { CloudBackupScreen } from 'src/screens/Onboarding/CloudBackupScreen'
import { LandingScreen } from 'src/screens/Onboarding/LandingScreen'
import { ManualBackupScreen } from 'src/screens/Onboarding/ManualBackupScreen'
import { NameAndColorScreen } from 'src/screens/Onboarding/NameAndColorScreen'
import { NotificationsSetupScreen } from 'src/screens/Onboarding/NotificationsSetupScreen'
import { OutroScreen } from 'src/screens/Onboarding/OutroScreen'
import { SecuritySetupScreen } from 'src/screens/Onboarding/SecuritySetupScreen'
import { PortfolioScreen } from 'src/screens/PortfolioScreen'
import { ProfileScreen } from 'src/screens/ProfileScreen'
import { RecipientSelectoScreen } from 'src/screens/RecipientSelectorScreen'
import { OnboardingScreens, Screens, Tabs } from 'src/screens/Screens'
import { SettingsChainsScreen } from 'src/screens/SettingsChainsScreen'
import { SettingsScreen } from 'src/screens/SettingsScreen'
import { SettingsSupportScreen } from 'src/screens/SettingsSupportScreen'
import { SettingsTestConfigs } from 'src/screens/SettingsTestConfigs'
import { SwapScreen } from 'src/screens/SwapScreen'
import { TokenDetailsScreen } from 'src/screens/TokenDetailsScreen'
import { TransferTokenScreen } from 'src/screens/TransferTokenScreen'
import { UserScreen } from 'src/screens/UserScreen'
import { dimensions } from 'src/styles/sizing'

const Tab = createBottomTabNavigator<TabParamList>()
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()
const AccountStack = createNativeStackNavigator<AccountStackParamList>()
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>()
const Drawer = createDrawerNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen component={PortfolioScreen} name={Tabs.Portfolio} options={navOptions.noHeader} />
      <Tab.Screen component={ProfileScreen} name={Tabs.Profile} options={navOptions.noHeader} />
      <Tab.Screen component={NFTScreen} name={Tabs.NFT} options={navOptions.noHeader} />
      <Tab.Screen component={ExploreScreen} name={Tabs.Explore} options={navOptions.noHeader} />
      <Tab.Screen component={View} name={Tabs.Swap} options={navOptions.noHeader} />
    </Tab.Navigator>
  )
}

function SettingsStackGroup() {
  return (
    <SettingsStack.Navigator screenOptions={navOptions.noHeader}>
      <SettingsStack.Screen component={SettingsScreen} name={Screens.Settings} />
      <SettingsStack.Screen component={SettingsChainsScreen} name={Screens.SettingsChains} />
      <SettingsStack.Screen component={SettingsSupportScreen} name={Screens.SettingsSupport} />
      <SettingsStack.Screen component={SettingsTestConfigs} name={Screens.SettingsTestConfigs} />
      <SettingsStack.Screen component={DevScreen} name={Screens.Dev} />
    </SettingsStack.Navigator>
  )
}

export function DrawerNavigator() {
  const theme = useAppTheme()
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AccountDrawer {...props} />}
      screenOptions={{
        drawerStyle: {
          width: dimensions.fullWidth - theme.spacing.xxl,
        },
      }}>
      <Drawer.Screen
        component={AppStackNavigator}
        name="AppStack"
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  )
}

export function AppStackNavigator() {
  const finishedOnboarding = useAppSelector(selectFinishedOnboarding)

  return (
    <AppStack.Navigator screenOptions={navOptions.noHeader}>
      {finishedOnboarding ? (
        <AppStack.Screen component={TabNavigator} name={Screens.TabNavigator} />
      ) : (
        <AppStack.Group>
          <OnboardingStack.Screen component={LandingScreen} name={OnboardingScreens.Landing} />
          <OnboardingStack.Screen
            component={NameAndColorScreen}
            name={OnboardingScreens.NameAndColor}
          />
          <OnboardingStack.Screen component={BackupScreen} name={OnboardingScreens.Backup} />
          <OnboardingStack.Screen
            component={NotificationsSetupScreen}
            name={OnboardingScreens.Notifications}
          />
          <OnboardingStack.Screen
            component={SecuritySetupScreen}
            name={OnboardingScreens.Security}
          />
          <OnboardingStack.Screen
            component={ManualBackupScreen}
            name={OnboardingScreens.BackupManual}
          />
          <OnboardingStack.Screen component={OutroScreen} name={OnboardingScreens.Outro} />
          <OnboardingStack.Screen
            component={CloudBackupScreen}
            name={OnboardingScreens.BackupCloud}
          />
          <OnboardingStack.Screen
            component={CloudBackupProcessingScreen}
            name={OnboardingScreens.BackupCloudProcessing}
          />
        </AppStack.Group>
      )}
      <AppStack.Group screenOptions={navOptions.presentationModal}>
        <AccountStack.Screen component={ImportAccountScreen} name={Screens.ImportAccount} />
        <AccountStack.Screen component={LedgerScreen} name={Screens.Ledger} />
      </AppStack.Group>
      <AppStack.Group>
        <AppStack.Screen component={TokenDetailsScreen} name={Screens.TokenDetails} />
        <AppStack.Screen component={NFTCollectionScreen} name={Screens.NFTCollection} />
        <AppStack.Screen component={UserScreen} name={Screens.User} />
      </AppStack.Group>
      <AppStack.Group screenOptions={navOptions.presentationModal}>
        <AppStack.Screen component={NotificationsScreen} name={Screens.Notifications} />
        <AppStack.Screen component={SwapScreen} name={Screens.Swap} />
        <AppStack.Screen component={CurrencySelectorScreen} name={Screens.CurrencySelector} />
        <AppStack.Screen component={RecipientSelectoScreen} name={Screens.RecipientSelector} />
        <AppStack.Screen component={SettingsStackGroup} name={Screens.SettingsStack} />
        <AppStack.Screen component={TransferTokenScreen} name={Screens.Transfer} />
        <AppStack.Screen component={EducationScreen} name={Screens.Education} />
      </AppStack.Group>
    </AppStack.Navigator>
  )
}

const navOptions = {
  noHeader: { headerShown: false },
  presentationModal: { presentation: 'modal' },
} as const
