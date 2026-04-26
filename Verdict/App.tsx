import React, { useState } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ModelDownloadModal } from './src/components/ModelDownloadModal';

const App = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <AppNavigator />
      <ModelDownloadModal 
        visible={showModal}
        onClose={() => setShowModal(false)}
        onDownloadComplete={() => setShowModal(false)}
      />
    </>
  );
};

export default App;
