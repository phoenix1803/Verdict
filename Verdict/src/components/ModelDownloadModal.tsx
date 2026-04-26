import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { CONFIG } from '../constants/config';

const { width } = Dimensions.get('window');

interface ModelDownloadModalProps {
    visible: boolean;
    onClose: () => void;
    onDownloadComplete: () => void;
}

export const ModelDownloadModal: React.FC<ModelDownloadModalProps> = ({ visible, onClose, onDownloadComplete }) => {
    const [progress, setProgress] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [fileExists, setFileExists] = useState(false);

    const modelPath = `${RNFS.DocumentDirectoryPath}/${CONFIG.MODELS.FILENAME}`;

    useEffect(() => {
        checkFile();
    }, []);

    const checkFile = async () => {
        const exists = await RNFS.exists(modelPath);
        setFileExists(exists);
        if (exists) {
            onDownloadComplete();
        }
    };

    const startDownload = async () => {
        setDownloading(true);
        const options = {
            fromUrl: CONFIG.MODELS.DOWNLOAD_URL,
            toFile: modelPath,
            progress: (res: any) => {
                const prog = res.bytesWritten / res.contentLength;
                setProgress(prog);
            },
            progressDivider: 1
        };

        try {
            const ret = RNFS.downloadFile(options);
            await ret.promise;
            setDownloading(false);
            setFileExists(true);
            onDownloadComplete();
            onClose();
        } catch (err) {
            console.error('Download error:', err);
            setDownloading(false);
        }
    };

    if (!visible && fileExists) return null;

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>VERDICT AI MODEL</Text>
                    <Text style={styles.description}>
                        To generate forensic reports locally, Verdict needs to download the AI model.
                    </Text>

                    {downloading ? (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={startDownload}>
                            <Text style={styles.buttonText}>DOWNLOAD MODEL</Text>
                        </TouchableOpacity>
                    )}
                    
                    {!downloading && (
                         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>USE CLOUD ONLY</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width * 0.85,
        backgroundColor: '#0B0B0B',
        padding: 24,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 20,
        fontFamily: 'JetBrains Mono', // Assuming this font is available or fallback
        fontWeight: 'bold',
        color: '#FF7A00',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#CCC',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#FF7A00',
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressContainer: {
        height: 40,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        position: 'relative',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FF7A00',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    progressText: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold',
        zIndex: 1,
    },
    closeButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontSize: 12,
        textDecorationLine: 'underline',
    }
});
