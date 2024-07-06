import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Define types for Images and ExecBoard
type ImageItem = {
    img_src: string | null;
};
type ImageUrls = string[];
type ExecBoard = {
    id: number | null;
    email: string | null;
    grade: string | null;
    major: string | null;
    name: string | null;
    position: string;
    picture: string;
};

interface DataContextProps {
    images: ImageUrls;
    exec: ExecBoard[];
    isLoading: boolean;
    fetchImages: () => Promise<void>;
    fetchExec: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<ImageUrls>([]);
    const [exec, setExec] = useState<ExecBoard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to preload images
    const preloadImages = (imageUrls: string[]) => {
        imageUrls.forEach((url) => {
            const img = new Image();
            img.src = url;
        });
    };

    // Fetch image URLs from Supabase
    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("HomePage")
                .select("img_src")
            if (error) {
                console.error('Error from Supabase:', error);
                throw error;
            }

            const imageUrls = (data as ImageItem[]).map((item: ImageItem) => item.img_src).filter((src): src is string => Boolean(src));
            setImages(imageUrls);
            preloadImages(imageUrls); // Preload images
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching images", error);
            setIsLoading(false);
        }
    };

    // Fetch exec board info from Supabase
    const fetchExec = async () => {
        try {
            const { data, error } = await supabase
                .from("ExecBoard")
                .select("*");
            if (error) {
                console.error('Error from Supabase:', error);
                throw error;
            }
            const sortedData = (data as ExecBoard[]).sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
            setExec(sortedData); // Ensure data is an array
        } catch (error) {
            console.error("Error fetching exec board info", error);
        }
    };

    useEffect(() => {
        fetchImages();
        fetchExec();
    }, []);

    return (
        <DataContext.Provider value={{ images, exec, isLoading, fetchImages, fetchExec }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
