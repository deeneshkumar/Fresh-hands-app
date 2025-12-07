import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import { Send, ArrowLeft, MoreVertical, Phone } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { COLORS } from '../../constants/colors';

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hello! How can we help you today?',
            isUser: false,
            timestamp: new Date(Date.now() - 60000),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText.trim(),
                isUser: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
            setInputText('');

            // Scroll to bottom
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: (Date.now() + 1).toString(),
                    text: "Thanks for reaching out. An agent will connect with you shortly.",
                    isUser: false,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, botResponse]);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }, 1000);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }) => (
        <View style={[
            styles.messageWrapper,
            item.isUser ? styles.userMessageWrapper : styles.botMessageWrapper
        ]}>
            <View style={[
                styles.messageContainer,
                item.isUser ? styles.userMessage : styles.botMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    item.isUser ? styles.userMessageText : styles.botMessageText
                ]}>{item.text}</Text>
                <Text style={[
                    styles.timestamp,
                    item.isUser ? styles.userTimestamp : styles.botTimestamp
                ]}>{formatTime(item.timestamp)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Customer Support</Text>
                    <Text style={styles.headerSubtitle}>Typically replies in 5 mins</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Phone color={COLORS.primary} size={20} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.keyboardContainer}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={COLORS.textLight}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={!inputText.trim()}
                    >
                        <Send color={COLORS.white} size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 10,
    },
    backButton: {
        padding: 4,
    },
    headerInfo: {
        flex: 1,
        marginLeft: THEME.spacing.m,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.success,
    },
    iconButton: {
        padding: 8,
    },
    keyboardContainer: {
        flex: 1,
    },
    messageList: {
        padding: THEME.spacing.m,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: THEME.spacing.m,
        width: '100%',
    },
    userMessageWrapper: {
        alignItems: 'flex-end',
    },
    botMessageWrapper: {
        alignItems: 'flex-start',
    },
    messageContainer: {
        maxWidth: '80%',
        padding: THEME.spacing.m,
        borderRadius: 20,
        elevation: 1,
    },
    userMessage: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    botMessage: {
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: COLORS.white,
    },
    botMessageText: {
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    botTimestamp: {
        color: COLORS.textLight,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        paddingHorizontal: THEME.spacing.l,
        paddingVertical: 10,
        marginRight: THEME.spacing.m,
        color: COLORS.text,
        maxHeight: 100,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.textLight,
        elevation: 0,
    },
});
