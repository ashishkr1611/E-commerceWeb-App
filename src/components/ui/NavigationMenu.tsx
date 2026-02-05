
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  LogIn,
  LogOut,
  UserPlus,
  ShieldCheck,
  ChevronDown,
  Heart
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeliveryLocationDialog } from "@/components/DeliveryLocationDialog";

import { useMenu } from "@/hooks/useMenu";

export function NavigationMenu() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useUser();
  const { setSearchQuery, categories } = useProducts();
  const { menuItems } = useMenu(); // Use hook
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate("/products");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl md:text-2xl font-heading font-bold text-primary whitespace-nowrap">
              Homemade Delights
            </Link>
            <DeliveryLocationDialog />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.filter(item => {
              if (item.requires_admin && !isAdmin) return false;
              if (item.requires_auth && !isAuthenticated) return false;
              return true;
            }).map((item) => (
              <Link key={item.id} to={item.path} className="hover:text-primary font-medium">
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center hover:text-primary font-medium focus:outline-none gap-1">
                Categories <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-xl border-amber-100">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link
                      to="/products"
                      state={{ category: cat.id }}
                      className="cursor-pointer py-2 px-4 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-muted rounded-full"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/cart"
              className="p-2 hover:bg-muted rounded-full relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {/* Wishlist Icon */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="hidden md:flex p-2 hover:bg-muted rounded-full relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
            )}
            {/* User Profile/Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:block p-2 hover:bg-muted rounded-full">
                  <User size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:block p-2 hover:bg-muted rounded-full">
                  <User size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Create Account</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              className="p-2 hover:bg-muted rounded-full md:hidden transition-transform duration-300 active:scale-95"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <div className={`transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden z-50 animate-accordion-down">
            <div className="container py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-2">
                {menuItems.filter(item => {
                  if (item.requires_admin && !isAdmin) return false;
                  if (item.requires_auth && !isAuthenticated) return false;
                  return true;
                }).map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="block py-2 px-4 hover:bg-amber-50 rounded-md font-medium animate-in slide-in-from-left-4 duration-500 fill-mode-forwards"
                    style={{ animationDelay: `${100 + (index * 50)}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3 block px-4">Categories</span>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {categories.map((cat, index) => (
                    <Link
                      key={cat.id}
                      to="/products"
                      state={{ category: cat.id }}
                      className="text-sm py-2 px-3 bg-amber-50 text-amber-900 rounded-md hover:bg-amber-100 transition-colors text-center border border-amber-100/50 animate-in zoom-in-50 duration-500 fill-mode-forwards"
                      style={{ animationDelay: `${250 + (index * 50)}ms` }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 hover:bg-amber-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn size={18} className="mr-3" /> Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 hover:bg-amber-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus size={18} className="mr-3" /> Create Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-amber-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="mr-3" /> My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center px-4 py-2 hover:bg-amber-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart size={18} className="mr-3" /> My Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 hover:bg-amber-50 rounded-md font-medium text-amber-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShieldCheck size={18} className="mr-3" /> Admin Panel
                      </Link>
                    )}
                    <button
                      className="flex w-full items-center px-4 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-md text-left"
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={18} className="mr-3" /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pt-4 pb-2 animate-in slide-in-from-top-2 fade-in duration-300">
            <form onSubmit={handleSearch} className="flex items-center border rounded-md overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                autoFocus
                className="w-full py-2 px-4 focus:outline-none"
              />
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
