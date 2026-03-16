import { useState } from 'react';
import type { SearchType } from '../data';

export function useShipmentTrackerHook() {
  const [searchType, setSearchType] = useState<SearchType>('guia');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = () => {
    if (!trackingNumber.trim()) return;
    window.open(
      `https://www.servientrega.com.ec/tracking/?guia=${trackingNumber}&tipo=${searchType}`,
      '_blank',
    );
  };

  return { searchType, setSearchType, trackingNumber, setTrackingNumber, handleSubmit };
}
