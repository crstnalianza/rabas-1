import React, { useState } from 'react';
import Logo from '../assets/rabas.png';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { GiPositionMarker } from "react-icons/gi";
import { FaPersonWalking } from "react-icons/fa6";
import Logo2 from '../assets/Rabasorso.png'
import { Link } from 'react-router-dom'; 

const NavUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-light fixed  top-0 z-50  h-[7rem] w-full px-4 shadow-lg ">
      <div className="flex justify-evenly gap-x-4 items-center h-full container mx-auto">
        
        {/** Logo */}
        <a className='z-50 flex  items-center justify-center  hover:scale-105 duration-500' href='/'>
       
         <img className="lg:h-[6rem] h-[5rem] text-center" src={Logo} alt="Logo" />
          <img className="lg:h-[12rem] h-[9rem] text-center" src={Logo2} alt="Logo" />
       
        </a>

        {/** Desktop Navigation */}
        <div className="hidden lg:flex space-x-8 items-center text-color1">
          <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
            <FaHome/> <a href='/'>Home</a>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex gap-1 text-color1 hover:text-gray-700 text-lg cursor-pointer hover:font-semibold duration-100 font-light">
                  <GiPositionMarker />
                 <a href='/destinations'> Destinations</a>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>
                    <div className="p-9 w-max bg-light shadow-md shadow-light">
                      <ul className="space-y-2 text-dark text-sm">
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Bulusan</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Bulan</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Barcelona</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Casiguran</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Castilla</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Donsol</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Gubat</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Irosin</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Juban</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Magallanes</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Matnog</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Pilar</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Prieto Diaz</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Sta. Magdalena</li></a>
                        <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Sorsogon City</li></a>
                      </ul>
                    </div>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex gap-1 text-color1 hover:text-gray-700 text-lg cursor-pointer hover:font-semibold duration-100 font-light">
                  <FaPersonWalking />
                  <a href='/Discover'>
                   Discover
                   </a>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>
                    <div className="w-max p-9 bg-light">
                      <ul className="text-dark text-sm space-y-3">
                        <a href='/activities'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Activities</li></a>
                        <a href='/accomodations'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Accommodations</li></a>
                        <a href='/foodplaces'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Food Places</li></a>       
                        <a href='/shops'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Shops</li></a>           
                      </ul>
                    </div>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/** Mobile Menu Button */}
        <div className="lg:hidden z-50">
          <button onClick={toggleMenu} className="text-color1 text-2xl p-2">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

       {/** Mobile Menu */}
       {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-light z-40 overflow-y-auto flex items-center justify-center animate-appearance-in">
            <div className="flex flex-col items-center space-y-6 w-full">
              <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
                <FaHome/> <a href='/'>Home</a>
              </div>
              <NavigationMenu className='z-50'>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex gap-1 text-color1 hover:text-gray-700 text-lg cursor-pointer hover:font-semibold duration-100 font-light">
                      <GiPositionMarker />
                      <a href='/destinations'> Destinations</a>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <div className="p-9 w-max bg-light shadow-md shadow-light">
                          <ul className="space-y-2 text-dark text-sm">
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Bulusan</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Bulan</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Barcelona</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Casiguran</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Castilla</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Donsol</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Gubat</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Irosin</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Juban</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Magallanes</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Matnog</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Pilar</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Prieto Diaz</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Sta. Magdalena</li></a>
                            <a href=''><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Sorsogon City</li></a>
                          </ul>
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex gap-1 text-color1 hover:text-gray-700 text-lg cursor-pointer hover:font-semibold duration-100 font-light">
                      <FaPersonWalking />
                      Discover
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <div className="w-max p-9 bg-light">
                          <ul className="text-dark text-sm space-y-3">
                          <a href='/activities'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Activities and Attractions</li></a>
                            <a href='/accomodations'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Accommodations</li></a>
                            <a href='/foodplaces'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Food Places</li></a>       
                            <a href='/shops'><li className='hover:tracking-widest hover:font-semibold duration-100 cursor-pointer'>Shops</li></a>                 
                          </ul>
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
                <h1>Deals</h1>
              </div>

              <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
                <h1>Transportation</h1>
              </div>
          
              <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
                <h1>About</h1>
              </div>
              
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="cursor-pointer">
                    <Avatar className='text-lg bg-slate-900 text-light' name="A" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu actions" className="bg-white shadow-lg rounded-md mt-2">
                  <DropdownItem key="profile">
                    <Link to='/userprofile' className="block w-full text-left">Profile</Link>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-md">
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        )}

        {/** Search Bar and User Avatar */}
        <div className="hidden lg:flex items-center gap-9">
          <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
           <h1>Deals</h1>
          </div>

          <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
           <h1>Transportation</h1>
          </div>
      
          <div className="hover:text-gray-700 cursor-pointer hover:font-semibold duration-100 text-lg font-light text-color1 flex items-center gap-1">
            <h1>About</h1>
          </div>
          
          <Dropdown placement="bottom-end ">
            <DropdownTrigger>
              <div className="cursor-pointer ml-6">
                <Avatar 
                  className='text-lg bg-color1 text-light hover:bg-color2/80 transition-colors duration-300' 
                  name="A" 
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu  >
              <DropdownItem key="profile">
                <Link to='/userprofile' className="block w-full text-left">
                  Profile
                </Link>
              </DropdownItem>
              <DropdownItem key="logout"  >Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default NavUser;