"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm text-muted-foreground">
                    <p>&copy; {year} Thiruvalluvar GPA Calculator. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}