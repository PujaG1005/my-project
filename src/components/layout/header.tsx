"use client";
import { GraduationCap, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [tempName, setTempName] = useState('');

    const handleLogin = () => {
        if (tempName) {
            setUserName(tempName);
            setIsLoggedIn(true);
            setShowLoginDialog(false);
            setTempName('');
        }
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
    };

    const navLinks = (
        <>
            <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/contact">Contact</Link>
            </Button>
            {isLoggedIn ? (
                 <div className="flex items-center gap-4">
                    <span className="font-medium flex items-center gap-2"><User /> {userName}</span>
                    <Button variant="ghost" onClick={handleLogout}><LogOut className="mr-2" /> Logout</Button>
                </div>
            ) : (
                <Button variant="ghost" onClick={() => setShowLoginDialog(true)}>Login</Button>
            )}
        </>
    );

    return (
        <>
            <header className="bg-card border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">GPA Calculator</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            {navLinks}
                        </nav>
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                      <SheetTitle className="sr-only">Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4 py-6">
                                       {navLinks}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                        <DialogDescription>
                           Enter your name to login.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="col-span-3"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleLogin}>Login</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
