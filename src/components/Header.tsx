"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <Navbar fluid className="p-5">
      <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Task Ujer
      </span>
      
      <div className="flex md:order-2">
        {isLoggedIn && user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar 
                alt={user.firstName} 
                img={user.image} 
                rounded 
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="block truncate text-sm text-gray-500">
                {user.email}
              </span>
            </DropdownHeader>
            <DropdownItem onClick={handleCartClick}>
              Cart
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Button onClick={handleLoginClick}>
            Login
          </Button>
        )}
        
        <NavbarToggle />
      </div>
      
      <NavbarCollapse>
        <NavbarLink href="/" active>
          Home
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
