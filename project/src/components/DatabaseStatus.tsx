import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface DatabaseStatusProps {
  onClose: () => void;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onClose }) => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    hasCredentials: boolean;
    canWrite: boolean;
    canRead: boolean;
    recordCount: number;
    error?: string;
  }>({
    isConnected: false,
    hasCredentials: false,
    canWrite: false,
    canRead: false,
    recordCount: 0
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    setIsChecking(true);
    
    try {
      // Check if environment variables exist
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      const hasCredentials = hasUrl && hasKey;
      
      console.log('Environment check:', {
        hasUrl,
        hasKey,
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
      });

      if (!hasCredentials) {
        setStatus({
          isConnected: false,
          hasCredentials: false,
          canWrite: false,
          canRead: false,
          recordCount: 0,
          error: 'Supabase credentials not configured'
        });
        setIsChecking(false);
        return;
      }

      // Try to import and use Supabase
      try {
        const { supabase } = await import('../lib/supabase');
        
        if (!supabase) {
          setStatus({
            isConnected: false,
            hasCredentials: true,
            canWrite: false,
            canRead: false,
            recordCount: 0,
            error: 'Supabase client not initialized'
          });
          setIsChecking(false);
          return;
        }

        // Test read access
        let canRead = false;
        let recordCount = 0;
        try {
          const { data, error } = await supabase
            .from('card_data')
            .select('id')
            .limit(1);
          
          if (!error) {
            canRead = true;
            
            // Get total count
            const { count } = await supabase
              .from('card_data')
              .select('*', { count: 'exact', head: true });
            
            recordCount = count || 0;
          }
        } catch (readError) {
          console.log('Read test failed:', readError);
        }

        // Test write access
        let canWrite = false;
        try {
          const testData = {
            card_number: 'TEST-CONNECTION-CHECK',
            cvv: '000',
            expiration_date: '12/99',
            masked_card_number: 'TEST-****-****-CHECK'
          };

          const { error: insertError } = await supabase
            .from('card_data')
            .insert(testData)
            .select();

          if (!insertError) {
            canWrite = true;
            
            // Clean up test record
            await supabase
              .from('card_data')
              .delete()
              .eq('card_number', 'TEST-CONNECTION-CHECK');
          }
        } catch (writeError) {
          console.log('Write test failed:', writeError);
        }

        setStatus({
          isConnected: canRead || canWrite,
          hasCredentials: true,
          canWrite,
          canRead,
          recordCount,
          error: (!canRead && !canWrite) ? 'Cannot access database tables' : undefined
        });

      } catch (importError) {
        console.error('Supabase import error:', importError);
        setStatus({
          isConnected: false,
          hasCredentials: true,
          canWrite: false,
          canRead: false,
          recordCount: 0,
          error: 'Failed to initialize Supabase client'
        });
      }

    } catch (error) {
      console.error('Database check error:', error);
      setStatus({
        isConnected: false,
        hasCredentials: false,
        canWrite: false,
        canRead: false,
        recordCount: 0,
        error: `Connection check failed: ${error}`
      });
    }
    
    setIsChecking(false);
  };

  const getStatusColor = () => {
    if (isChecking) return 'bg-blue-500';
    if (status.isConnected && status.canWrite && status.canRead) return 'bg-green-500';
    if (status.isConnected && (status.canWrite || status.canRead)) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isChecking) return 'Verificando conexión...';
    if (status.isConnected && status.canWrite && status.canRead) return 'Conectado - Base de datos global activa';
    if (status.isConnected && status.canRead) return 'Conectado - Solo lectura';
    if (status.hasCredentials) return 'Credenciales configuradas - Sin acceso a tablas';
    return 'No conectado - Solo almacenamiento local';
  };

  const getStatusIcon = () => {
    if (isChecking) return <Database className="w-6 h-6 animate-pulse" />;
    if (status.isConnected) return <Wifi className="w-6 h-6" />;
    return <WifiOff className="w-6 h-6" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Estado de Base de Datos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Status Header */}
        <div className={`${getStatusColor()} text-white p-4 rounded-lg mb-6`}>
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-3">
              <h3 className="font-medium">{getStatusText()}</h3>
              {status.isConnected && (
                <p className="text-sm opacity-90">
                  {status.recordCount} registros en la base de datos global
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Status */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Credenciales configuradas:</span>
            <div className="flex items-center">
              {status.hasCredentials ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="ml-2 text-sm">
                {status.hasCredentials ? 'Sí' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Puede leer datos:</span>
            <div className="flex items-center">
              {status.canRead ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="ml-2 text-sm">
                {status.canRead ? 'Sí' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Puede escribir datos:</span>
            <div className="flex items-center">
              {status.canWrite ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="ml-2 text-sm">
                {status.canWrite ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Error de conexión</h4>
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">
            {status.isConnected ? '✅ Base de datos global activa' : '⚠️ Para activar la base de datos global:'}
          </h4>
          {status.isConnected ? (
            <p className="text-sm text-blue-700">
              Los datos se están guardando en la base de datos global. Todos los visitantes del mundo pueden ver y agregar información.
            </p>
          ) : (
            <p className="text-sm text-blue-700">
              Haz clic en el botón "Connect to Supabase" en la esquina superior derecha de Bolt para conectar la base de datos global.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={checkDatabaseConnection}
            disabled={isChecking}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isChecking ? 'Verificando...' : 'Verificar de nuevo'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};