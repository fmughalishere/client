"use client";
import React, { useState } from 'react';
import { policyData, consentText } from '../constants';

const PrivacyPolicy: React.FC = () => {
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = () => {
        if (agreed) {
            alert("Policy Accepted!");
        } else {
            alert("Please agree to the terms first.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#5DBB63] py-6 px-8 text-white text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy & User Consent</h1>
                </div>

                <div className="p-8 space-y-8">
                    {policyData.map((item) => (
                        <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {item.id}. {item.titleEn}
                                </h3>
                                <p className="text-gray-600 mt-1 leading-relaxed text-sm sm:text-base">
                                    {item.descEn}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border-r-4 border-[#00004d]" dir="rtl">
                                <h3 className="text-lg font-bold text-[#00004d] mb-1 leading-loose" style={{ fontFamily: 'serif' }}>
                                    {item.id}۔ {item.titleUr}
                                </h3>
                                <p className="text-gray-700 leading-loose text-sm sm:text-base" style={{ fontFamily: 'serif' }}>
                                    {item.descUr}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 p-8 border-t border-blue-100">
                    <div className="flex flex-col items-center space-y-4">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-[#00004d] border-gray-300 rounded focus:ring-blue-500"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <span className="text-gray-800 font-semibold text-sm sm:text-base">
                                {consentText.en}
                            </span>
                        </label>
                        
                        <p className="text-gray-700 text-center text-sm sm:text-base font-medium" dir="rtl">
                            {consentText.ur}
                        </p>

                        <button 
                            onClick={handleSubmit}
                            disabled={!agreed}
                            className={`mt-4 px-10 py-3 rounded-[13px] font-bold text-white transition-all duration-300 ${
                                agreed 
                                ? 'bg-[#00004d] hover:bg-blue-700 shadow-md' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;