import * as AppleAuthentication from 'expo-apple-authentication';
import { createClient } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button, View } from 'react-native';

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '', process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '');

export default function AccountScreen() {
  const signUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
  const deleteAccount = () => supabase.functions.invoke('delete-account');

  return (
    <View>
      <Button title="Sign up" onPress={() => signUp('', '')} />
      <Button title="Continue with Google" onPress={() => GoogleSignin.signIn()} />
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={{ height: 44 }}
        onPress={() => AppleAuthentication.signInAsync()}
      />
      <Button title="Delete account" onPress={deleteAccount} />
    </View>
  );
}
