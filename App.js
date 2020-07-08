import * as React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Magic } from '@magic-sdk/react-native';
import Constants from 'expo-constants';

const magic = new Magic('pk_test_4210A822FBFD3437');

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default function App() {
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');

  const fetchUser = React.useCallback(async () => {
    if (await magic.user.isLoggedIn()) {
      setUser(await magic.user.getMetadata());
    }
  }, []);

  const login = React.useCallback(async () => {
    if (email) {
      await magic.auth.loginWithMagicLink({ email });
      await fetchUser();
    }
  }, [email, fetchUser]);

  const logout = React.useCallback(async () => {
    await magic.user.logout();
    setUser(null);
    setEmail('');
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {!user
        ? (
          <>
            <Text style={styles.paragraph}>
              Enter your email to authenticate!
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder='email@company.co'
              textContentType='emailAddress'
            />
            <Button title="login" onPress={login} />
          </>
        ) : (
          <>
            <Text style={styles.paragraph}>
              Hi {JSON.stringify(user, null, 2)}
            </Text>
            <Button title="logout" onPress={logout} />
          </>
        )}
        <magic.Relayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
