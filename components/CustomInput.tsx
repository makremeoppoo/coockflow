import styles from "@/app/styles";
import { CustomInputProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from 'react-native';

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default",
    icon
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);


    return (
        <View style={styles.inputCard}>
          {label && <Text style={styles.inputLabel}>{label}</Text>}
          <View style={[styles.inputContainer, isFocused && { borderColor: '#f97316' }]}>
            {icon && <Ionicons name={icon as any} size={20} color="#f97316" style={styles.inputIcon} />}
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
    )
}
export default CustomInput
