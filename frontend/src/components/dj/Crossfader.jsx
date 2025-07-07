import React from 'react';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const Crossfader = ({ value, onChange, masterVolume, onMasterVolumeChange }) => {
  return (
    <div className="space-y-6">
      {/* Crossfader */}
      <Card className="bg-black/40 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-bold text-cyan-400">
            CROSSFADER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Crossfader track labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span className="font-bold">A</span>
              <span className="font-bold">B</span>
            </div>
            
            {/* Main crossfader */}
            <Slider
              value={[value]}
              onValueChange={(val) => onChange(val[0])}
              min={0}
              max={100}
              step={1}
              className="crossfader-slider mb-4"
            />
            
            {/* Position indicator */}
            <div className="text-center text-xs">
              <span className={`${value < 40 ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>
                A
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className={`${value > 60 ? 'text-purple-400 font-bold' : 'text-gray-500'}`}>
                B
              </span>
            </div>
            
            {/* Crossfader curve indicator */}
            <div className="mt-2 h-8 bg-gray-800 rounded relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-transparent transition-all duration-100"
                style={{ width: `${100 - value}%` }}
              ></div>
              <div 
                className="absolute top-0 right-0 h-full bg-gradient-to-l from-purple-500 to-transparent transition-all duration-100"
                style={{ width: `${value}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                MIX
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Master Volume */}
      <Card className="bg-black/40 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-bold text-cyan-400">
            MASTER VOLUME
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Slider
              value={[masterVolume * 100]}
              onValueChange={(val) => onMasterVolumeChange(val[0] / 100)}
              min={0}
              max={100}
              step={1}
              orientation="vertical"
              className="h-32 mx-auto master-volume-slider"
            />
            
            {/* Volume level indicator */}
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {Math.round(masterVolume * 100)}%
              </div>
              
              {/* Volume meter visualization */}
              <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full transition-all duration-150 ${
                    masterVolume > 0.8 ? 'bg-red-500' : 
                    masterVolume > 0.6 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${masterVolume * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Peak warning */}
            {masterVolume > 0.9 && (
              <div className="text-center text-xs text-red-400 animate-pulse">
                ⚠️ PEAK WARNING
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mix Monitoring */}
      <Card className="bg-black/40 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-bold text-cyan-400">
            OUTPUT METER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* L/R Channel meters */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">L</div>
                <div className="h-20 w-4 bg-gray-800 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ 
                      height: `${Math.min(100, (masterVolume * (100 - value) / 50) * 80)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">R</div>
                <div className="h-20 w-4 bg-gray-800 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ 
                      height: `${Math.min(100, (masterVolume * value / 50) * 80)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Output level */}
            <div className="text-center text-xs text-gray-400">
              OUTPUT LEVEL
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crossfader;