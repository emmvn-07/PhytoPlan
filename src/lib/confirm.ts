import { Alert } from 'react-native';

/** Native confirm dialog. Resolves true when the user taps the confirm button. */
export function confirm(title: string, message: string, confirmLabel = 'Confirm', destructive = false) {
  return new Promise<boolean>((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
    ]);
  });
}
