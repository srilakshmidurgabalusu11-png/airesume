import React, { useState } from 'react';
import BatchUploader from './BatchUploader';
import CandidateRankingTable from './CandidateRankingTable';
import CandidateComparisonModal from './CandidateComparisonModal';
import CandidateDossierModal from './CandidateDossierModal';

export const RecruiterPortal = () => {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  return (
    <div>
      <BatchUploader />
      <CandidateRankingTable onOpenCompareModal={() => setIsCompareModalOpen(true)} />
      <CandidateComparisonModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
      <CandidateDossierModal />
    </div>
  );
};

export default RecruiterPortal;
