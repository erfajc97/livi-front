import { useState } from 'react';
import type { SearchType } from '../data';

export function useShipmentTrackerHook() {
  const [searchType, setSearchType] = useState<SearchType>('guia');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = () => {
    const code = trackingNumber.trim();
    if (!code) return;
    window.open(
      `https://www.servientrega.com.ec/Tracking/Index/?guia=${encodeURIComponent(code)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return { searchType, setSearchType, trackingNumber, setTrackingNumber, handleSubmit };
}
