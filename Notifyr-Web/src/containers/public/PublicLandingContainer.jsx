import React from 'react';
import Navbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import FeatureGrid from '../../components/public/FeatureGrid';

export default function PublicLandingContainer() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <HeroSection />
      </div>
      <FeatureGrid />
    </div>
  );
}