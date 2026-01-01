import React from 'react';
import { MicropaymentButton } from '../components/MicropaymentButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PremiumContent = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Premium Content</CardTitle>
                    <CardDescription>
                        Unlock exclusive content by making a micropayment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <MicropaymentButton />
                </CardContent>
            </Card>
        </div>
    );
};

export default PremiumContent;
