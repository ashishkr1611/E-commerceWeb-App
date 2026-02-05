import React, { createContext, useContext, useState, useEffect } from 'react';

type LocationContextType = {
    pincode: string;
    setPincode: (pincode: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pincode, setPincodeState] = useState<string>("");

    useEffect(() => {
        const savedPincode = localStorage.getItem('delivery_pincode');
        if (savedPincode) {
            setPincodeState(savedPincode);
        }
    }, []);

    const setPincode = (code: string) => {
        setPincodeState(code);
        localStorage.setItem('delivery_pincode', code);
    };

    return (
        <LocationContext.Provider value={{ pincode, setPincode }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
