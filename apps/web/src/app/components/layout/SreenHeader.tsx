import { useExtensionNavigation } from 'src/app/navigation/utils'
import { Flex, Icons, Text, TouchableArea } from 'ui/src'
import { iconSizes } from 'ui/src/theme'

export function ScreenHeader({
  onBackClick,
  title,
  rightColumn,
}: {
  title: JSX.Element | string
  onBackClick?: () => void
  rightColumn?: JSX.Element
}): JSX.Element {
  const { navigateBack } = useExtensionNavigation()

  return (
    <Flex row alignItems="center" width="100%">
      <TouchableArea onPress={onBackClick ?? navigateBack}>
        <Icons.BackArrow color="$neutral2" height={iconSizes.icon24} width={iconSizes.icon24} />
      </TouchableArea>

      {/* When there's no right column, we adjust the margin to match the icon width. This is so that the title is centered on the screen. */}
      <Flex centered fill mr={rightColumn ? '$none' : iconSizes.icon24} py="$spacing8">
        <Text variant="bodyLarge">{title}</Text>
      </Flex>

      {rightColumn && <Flex>{rightColumn}</Flex>}
    </Flex>
  )
}
