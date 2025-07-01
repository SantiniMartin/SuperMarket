import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeCustom } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user, updateProfile } = useAuth();
  const { favorites } = useFavorites();
  const { theme, setTheme } = useThemeCustom();
  const totalFav = favorites.length;
  const totalFavValue = favorites.reduce((acc, p) => acc + (p.price || 0), 0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editUsername, setEditUsername] = React.useState(user?.username || '');
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handlePickImage = async () => {
    setModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      await updateProfile({ avatar: result.assets[0].uri });
      if (user?.email) {
        const usersRaw = await AsyncStorage.getItem('users');
        if (usersRaw) {
          let usersArr = JSON.parse(usersRaw);
          usersArr = usersArr.map((u: any) =>
            u.email === user.email ? { ...u, avatar: result.assets[0].uri } : u
          );
          await AsyncStorage.setItem('users', JSON.stringify(usersArr));
        }
      }
    }
  };

  const handleSaveUsername = async () => {
    setSaving(true);
    await updateProfile({ username: editUsername });
    setSaving(false);
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Modal de edición de username y cambio de foto */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 22, padding: 28, width: 330, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 18, color: '#222' }}>Editar perfil</Text>
            <TouchableOpacity style={{ marginBottom: 18, alignItems: 'center' }} onPress={handlePickImage}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#2e7d32' }} />
              ) : (
                <View style={[styles.avatarBox, { marginRight: 0, width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#2e7d32' }]}> <Text style={[styles.avatarText, { fontSize: 38 }]}>{user?.name?.charAt(0) || '?'}</Text> </View>
              )}
              <Text style={{ color: '#2e7d32', marginTop: 8, fontSize: 15, fontWeight: 'bold' }}>Cambiar foto</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafbfc', borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 10 }}>
                <Icon name="person-outline" size={20} color="#888" style={{ marginRight: 6 }} />
                <TextInput
                  style={{ flex: 1, height: 44, fontSize: 16, color: '#222' }}
                  placeholder="Nombre de usuario"
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  maxLength={30}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 18, width: '100%', justifyContent: 'center' }}>
              <Pressable onPress={() => setEditModalVisible(false)} style={{ paddingVertical: 12, paddingHorizontal: 22, borderRadius: 10, backgroundColor: '#eee', marginRight: 8 }}>
                <Text style={{ color: '#e53935', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleSaveUsername} style={{ paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10, backgroundColor: '#2e7d32', minWidth: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} disabled={saving}>
                {saving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 280, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>Cambiar foto de perfil</Text>
            <Text style={{ color: '#555', marginBottom: 20, textAlign: 'center' }}>¿Deseas seleccionar una nueva foto de perfil?</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable onPress={() => setModalVisible(false)} style={{ padding: 10, borderRadius: 8, backgroundColor: '#eee', marginRight: 8 }}>
                <Text style={{ color: '#e53935', fontWeight: 'bold' }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handlePickImage} style={{ padding: 10, borderRadius: 8, backgroundColor: '#2e7d32' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Seleccionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Perfil */}
      <View style={styles.profileBox}>
        <TouchableOpacity style={styles.avatarBox} onPress={() => setModalVisible(true)}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={{ width: 56, height: 56, borderRadius: 28 }} />
          ) : (
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.username || user?.name || 'Usuario'}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
        </View>
        <TouchableOpacity style={styles.profileSettings} onPress={() => { setEditUsername(user?.username || ''); setEditModalVisible(true); }}>
          <Icon name="settings-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>
      {/* Resumen favoritos */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNum}>{totalFav}</Text>
          <Text style={styles.summaryLabel}>Favorito</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNum}>${totalFavValue.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>En fav</Text>
        </View>
      </View>
      {/* Opciones */}
      <View style={styles.menuBox}>
        <MenuItem icon="notifications-outline" label="Notificaciones" onPress={() => router.push('/notifications')} />
        <MenuItem icon="card-outline" label="Métodos de pagos" />
        <MenuItem icon="receipt-outline" label="Historial de compras" onPress={() => router.push('/history')} />
        <MenuItem icon="star-outline" label="Tiendas favoritas" />
        <View style={styles.menuItem}>
          <Icon name="color-palette-outline" size={22} color="#555" style={{ marginRight: 16 }} />
          <Text style={styles.menuLabel}>Apariencia</Text>
          <View style={styles.themeSwitchRow}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
              onPress={() => setTheme('light')}
            >
              <Icon name="sunny-outline" size={18} color={theme === 'light' ? '#2e7d32' : '#888'} />
              <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
              onPress={() => setTheme('dark')}
            >
              <Icon name="moon-outline" size={18} color={theme === 'dark' ? '#2e7d32' : '#888'} />
              <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>Oscuro</Text>
            </TouchableOpacity>
          </View>
        </View>
        <MenuItem icon="help-circle-outline" label="Ayuda y soporte" />
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
      <Icon name={icon} size={22} color="#555" style={{ marginRight: 16 }} />
      <Text style={styles.menuLabel}>{label}</Text>
      {onPress && <Icon name="chevron-forward-outline" size={20} color="#aaa" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    padding: 16,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    color: '#555',
    fontWeight: 'bold',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
  },
  profileEmail: {
    color: '#888',
    fontSize: 14,
  },
  profileSettings: {
    marginLeft: 10,
    padding: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  summaryNum: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2e7d32',
    marginBottom: 2,
  },
  summaryLabel: {
    color: '#555',
    fontSize: 14,
  },
  menuBox: {
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  themeSwitchRow: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 8,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
  },
  themeBtnActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    borderWidth: 1,
  },
  themeBtnText: {
    marginLeft: 4,
    color: '#888',
    fontWeight: 'bold',
    fontSize: 14,
  },
  themeBtnTextActive: {
    color: '#2e7d32',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    backgroundColor: '#fafbfc',
    fontSize: 16,
    color: '#222',
  },
});
