'use client';

import { useState } from 'react';

import Header from "./header";
import ProjectsList from "./projectsList";

export default function Dashboard(){
  const [search, setSearch] = useState('');

  return(
    <div className="bg-[#121626] min-h-screen">
      <Header
        search={search}
        onSearchChange={setSearch}
      />
      
      <ProjectsList search={search} />
    </div>
  );
}