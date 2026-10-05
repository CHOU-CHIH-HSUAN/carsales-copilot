// 每頁上方的標題列：左邊大標題，右邊可放一個小元件（按鈕、標籤…）
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ScreenHeader({ title, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
});
