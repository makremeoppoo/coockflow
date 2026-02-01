import styles from '@/app/styles';
import { CustomButtonProps } from "@/type";
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const CustomButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: CustomButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            {leftIcon}

            <View style={styles.extractButton}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ): (
                    <Text style={styles.extractButtonText}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}
export default CustomButton
