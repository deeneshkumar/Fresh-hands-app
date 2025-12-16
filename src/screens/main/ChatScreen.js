import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ArrowLeft, Phone } from 'lucide-react-native';
import { THEME } from '../../constants/theme';
import { COLORS } from '../../constants/colors';
import { sendToGemini } from '../../services/gemini';

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hello! How can we help you today?',
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userText = inputText.trim();

        const userMessage = {
            id: Date.now().toString(),
            text: userText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const replyText = await sendToGemini(userText);

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: replyText,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    text: 'Sorry, something went wrong. Please try again.',
                    isUser: false,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const formatTime = date =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageWrapper,
                item.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
            ]}
        >
            <View
                style={[
                    styles.messageContainer,
                    item.isUser ? styles.userMessage : styles.botMessage,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        item.isUser ? styles.userMessageText : styles.botMessageText,
                    ]}
                >
                    {item.text}
                </Text>
                <Text
                    style={[
                        styles.timestamp,
                        item.isUser ? styles.userTimestamp : styles.botTimestamp,
                    ]}
                >
                    {formatTime(item.timestamp)}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Customer Support</Text>
                    <Text style={styles.headerSubtitle}>AI Support • Online</Text>
                </View>

                <TouchableOpacity style={styles.iconButton}>
                    <Phone color={COLORS.primary} size={20} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                style={{ flex: 1 }}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                />

                {loading && (
                    <Text style={styles.typingText}>Support is typing…</Text>
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={COLORS.textLight}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!inputText.trim() || loading}
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || loading) && styles.sendButtonDisabled,
                        ]}
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
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
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
    messageList: {
        padding: THEME.spacing.m,
    },
    messageWrapper: {
        marginBottom: THEME.spacing.m,
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
        borderRadius: 18,
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
        color: 'rgba(255,255,255,0.7)',
    },
    botTimestamp: {
        color: COLORS.textLight,
    },
    typingText: {
        marginLeft: 20,
        marginBottom: 6,
        color: COLORS.textLight,
        fontSize: 12,
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
        maxHeight: 120,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.textLight,
    },
});
