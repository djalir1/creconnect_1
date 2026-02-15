'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Studios from "@/components/Studios";
import StudioPartners from "@/components/StudioPartners";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function Home() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: "",
    activity: "",
    date: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.append("location", searchData.location);
    if (searchData.activity) params.append("q", searchData.activity);
    if (searchData.date) params.append("date", searchData.date);

    router.push(`/studios?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col">
      <Navbar />
      
      <section className="relative flex-1 flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
        <Image
          src="/background.jpeg"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center z-0"
          quality={95}
        />
        
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center w-full">
          <h1 className="text-4xl md:text-6xl uppercase font-extrabold tracking-tight text-white drop-shadow-lg px-2 max-w-4xl mb-10">
            discover creative studios and spaces
          </h1>

          {/* REFINED SEARCH BAR CONTAINER */}
          <div className="w-full md:w-[95%] lg:w-[90%] max-w-6xl p-3 md:p-4 bg-white/10 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/20">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              
              {/* INPUT GROUP: Location & Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:flex-1">
                <Select 
                  value={searchData.location} 
                  onValueChange={(v) => setSearchData({ ...searchData, location: v })}
                >
                  <SelectTrigger className="bg-white border-none text-black h-14 rounded-full px-6 focus:ring-2 focus:ring-white/20 shadow-sm">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Gasabo">Gasabo</SelectItem>
                      <SelectItem value="Kicukiro">Kicukiro</SelectItem>
                      <SelectItem value="Nyarugenge">Nyarugenge</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="What are you looking for?"
                  value={searchData.activity}
                  onChange={(e) => setSearchData({ ...searchData, activity: e.target.value })}
                  className="bg-white border-none text-black h-14 rounded-full px-6 focus:ring-2 focus:ring-white/20 shadow-sm"
                />
              </div>

              {/* INPUT GROUP: Date */}
              <div className="w-full lg:w-[220px]">
                <Input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  className="bg-white border-none text-black h-14 rounded-full px-6 focus:ring-2 focus:ring-white/20 shadow-sm"
                />
              </div>
              
              {/* REFINED SEARCH BUTTON (Matches "List Your Studio" style) */}
              <Button
                onClick={handleSearch}
                className="w-full lg:w-[180px] bg-transparent hover:bg-white hover:text-black text-white border border-white/40 backdrop-blur-md rounded-full h-14 px-8 text-sm font-bold uppercase tracking-widest transition-all duration-300 active:scale-95"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Studios />
      <StudioPartners />
      <Testimonials />
      <Footer />
    </main>
  );
}