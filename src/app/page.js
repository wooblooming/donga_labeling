"use client";

import './styles.css';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Image from "next/image";

export default function Home() {
  const [fileData, setFileData] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [refinedFileData, setRefinedFileData] = useState(null);
  const [refinedColumnHeaders, setRefinedColumnHeaders] = useState([]);
  const [isRefinedPreviewVisible, setIsRefinedPreviewVisible] = useState(false);
  const [summaryFileData, setSummaryFileData] = useState(null);
  const [summaryColumnHeaders, setSummaryColumnHeaders] = useState([]);
  const [isSummaryPreviewVisible, setIsSummaryPreviewVisible] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryCompleted, setIsSummaryCompleted] = useState(false);
  const [keywordsFileData, setKeywordsFileData] = useState(null);
  const [keywordsColumnHeaders, setKeywordsColumnHeaders] = useState([]);
  const [isKeywordsPreviewVisible, setIsKeywordsPreviewVisible] = useState(false);
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(false);
  const [isKeywordsCompleted, setIsKeywordsCompleted] = useState(false);
  const [majorsList, setMajorsList] = useState(null);
  const [schoolSubjectUnits, setSchoolSubjectUnits] = useState(null);
  const [isMajorsPreviewVisible, setIsMajorsPreviewVisible] = useState(false);
  const [isUnitsPreviewVisible, setIsUnitsPreviewVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLabelingReady, setIsLabelingReady] = useState(false);
  const [isLabelingCompleted, setIsLabelingCompleted] = useState(false);
  const [finalFileData, setFinalFileData] = useState(null);
  const [finalColumnHeaders, setFinalColumnHeaders] = useState([]);
  const [isFinalPreviewVisible, setIsFinalPreviewVisible] = useState(false);
  const [isLabelingLoading, setIsLabelingLoading] = useState(false);
  const [showDataRefineSection, setShowDataRefineSection] = useState(false);
  const [showLabelingSection, setShowLabelingSection] = useState(false);
  const [showSummarySection, setShowSummarySection] = useState(false);
  const [showKeywordsSection, setShowKeywordsSection] = useState(false);
  const [showVectorSection, setShowVectorSection] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    const reader = new FileReader();
    console.log('File uploaded:', file.name);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      console.log('First sheet name:', firstSheetName);
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Parsed JSON data:', jsonData);
      if (jsonData.length > 0) {
        setFileData(jsonData.slice(1));
        setColumnHeaders(jsonData[0]);
        setShowDataRefineSection(true);
      } else {
        console.error('No data found in the uploaded file.');
      }
      setDropdownOptions([...new Set(jsonData.slice(1).map(item => item[0]))]);
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDataRefine = () => {
    const nonContentColumns = selectedColumns.filter(col => col !== '내용');
    if (nonContentColumns.length > 0) {
      alert(`'${nonContentColumns.join(", ")}' 컬럼에는 HTML 요소가 없습니다.`);
      return;
    }

    if (!selectedColumns.includes('내용')) {
      alert("'내용' 컬럼을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setIsCompleted(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      setShowLabelingSection(true);
      setShowSummarySection(true);
      // Load and preview the specified Excel file
      console.log('Attempting to load the specified Excel file...');
      fetch('/2. 본문 정제 후.xlsx')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.arrayBuffer();
        })
        .then(data => {
          console.log('Excel file loaded successfully.');
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log('Parsed Excel data:', jsonData);
          setRefinedFileData(jsonData.slice(1));
          setRefinedColumnHeaders(jsonData[0]);
        })
        .catch(error => console.error('Error loading Excel file:', error));
    }, 3000);
  };

  const handleRefinedPreviewClick = () => {
    if (refinedFileData) {
      setIsRefinedPreviewVisible(true);
    } else {
      console.error('Refined file data is not available.');
    }
  };

  const handleSummaryClick = () => {
    setIsSummaryLoading(true);
    setIsSummaryCompleted(false);
    setTimeout(() => {
      setIsSummaryLoading(false);
      setIsSummaryCompleted(true);
      setShowKeywordsSection(true);
      // Load the specified Excel file
      fetch('/3. 본문 내용 요약 후.xlsx')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.arrayBuffer();
        })
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setSummaryFileData(jsonData.slice(1));
          setSummaryColumnHeaders(jsonData[0]);
        })
        .catch(error => console.error('Error loading Excel file:', error));
    }, 4000);
  };

  const handleKeywordsClick = () => {
    setIsKeywordsLoading(true);
    setIsKeywordsCompleted(false);
    setTimeout(() => {
      setIsKeywordsLoading(false);
      setIsKeywordsCompleted(true);
      setShowVectorSection(true);
      // Load the specified Excel file
      fetch('/4. 본문 키워드 추출 후.xlsx')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.arrayBuffer();
        })
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setKeywordsFileData(jsonData.slice(1));
          setKeywordsColumnHeaders(jsonData[0]);
        })
        .catch(error => console.error('Error loading Excel file:', error));
    }, 4000);
  };

  useEffect(() => {
    fetch('/majors_list.json')
      .then(response => response.json())
      .then(data => setMajorsList(data))
      .catch(error => console.error('Error loading majors list:', error));

    fetch('/school_subject_units.json')
      .then(response => response.json())
      .then(data => setSchoolSubjectUnits(data))
      .catch(error => console.error('Error loading school subject units:', error));
  }, []);

  const handleLabelingStart = () => {
    setIsLabelingLoading(true);
    setIsLabelingCompleted(false);
    setTimeout(() => {
      // Load the specified Excel file
      fetch('/5. 전공계열 추출 후.xlsx')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.arrayBuffer();
        })
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setFinalFileData(jsonData.slice(1));
          setFinalColumnHeaders(jsonData[0]);
          setIsLabelingLoading(false);
          setIsLabelingCompleted(true);
        })
        .catch(error => {
          console.error('Error loading Excel file:', error);
          setIsLabelingLoading(false);
        });
    }, 4000);
  };

  // Add useEffect for auto-scrolling
  useEffect(() => {
    if (showDataRefineSection || showLabelingSection || showKeywordsSection || showVectorSection) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showDataRefineSection, showLabelingSection, showKeywordsSection, showVectorSection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 shadow-md ${isPreviewVisible || isRefinedPreviewVisible || isSummaryPreviewVisible || isKeywordsPreviewVisible || isFinalPreviewVisible || isMajorsPreviewVisible || isUnitsPreviewVisible ? 'hidden' : ''}`}>
        <h1 className="text-center text-3xl font-extrabold tracking-wide">DONGA AUTO LABELING PROGRAM</h1>
      </header>
      <main className="flex flex-col gap-8 items-center pt-28 w-11/12 max-w-4xl mx-auto">
        <section className="w-full bg-white p-8 rounded-lg shadow-lg mb-6 slide-down">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">1. 원천데이터 파일 업로드</h2>
          <div className="flex items-center justify-between">
            <p className="text-indigo-600 font-semibold">원천데이터 파일을 올려주세요</p>
            <button 
              {...getRootProps()} 
              className="ml-4 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              파일 선택
            </button>
            <input {...getInputProps()} />
          </div>
          {fileName && <p className="text-sm text-gray-500 mt-2">업로드된 파일: {fileName}</p>}
          <button 
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className="mt-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
          >
            {isPreviewVisible ? '▲ 미리보기 닫기' : '▼ 미리보기 열기'}
          </button>
        </section>

        {showDataRefineSection && (
          <section className="w-full bg-white p-8 rounded-lg shadow-lg mb-6 slide-down">
            <h2 className="text-xl font-bold text-indigo-600 mb-4">2. 데이터 정제하기</h2>
            <p className="text-sm text-gray-600 mb-4">업로드 한 데이터에서 HTML 요소가 포함된 본문 컬럼을 선택해주세요</p>
            {fileData && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  {columnHeaders.map((header, index) => (
                    <label key={index} className="flex items-center mb-2">
                      <input 
                        type="checkbox" 
                        value={header} 
                        checked={selectedColumns.includes(header)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedColumns(prev =>
                            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
                          );
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{header}</span>
                    </label>
                  ))}
                </div>
                {selectedColumns.length > 0 && (
                  <div className="w-full bg-gray-50 p-2 border rounded-lg mt-4">
                    <h3 className="text-sm font-semibold text-gray-500">선택한 옵컬럼:</h3>
                    <ul className="list-disc pl-5">
                      {selectedColumns.map((col, index) => (
                        <li key={index} className="text-sm text-gray-700">{col}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button 
                  onClick={handleDataRefine}
                  className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mt-4"
                >
                  데이터 정제하기
                </button>
                {isLoading && (
                  <div className="flex items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                    <div className="loader mb-4"></div>
                    <p className="text-lg font-bold text-gray-700">정제 중...</p>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                    <p className="text-4xl text-green-600">✔ Clear</p>
                    <p className="text-md text-gray-700 mt-2">본문 컬럼의 정제 데이터가 <span className="text-lg text-red-600">'cleaned_content'</span> 컬럼으로 새로 저장되었습니다.</p>
                    <div className="flex gap-4 mt-4">
                      <button 
                        onClick={handleRefinedPreviewClick}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                      >
                        정제된 데이터 미리보기
                      </button>
                      <a 
                        href="/2. 본문 정제 후.xlsx"
                        download
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                )}
                {isRefinedPreviewVisible && refinedFileData && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <button 
                        onClick={() => setIsRefinedPreviewVisible(false)}
                        className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                      >
                        닫기
                      </button>
                      <h3 className="text-lg font-semibold text-gray-700 mt-2">정제된 데이터 미리보기</h3>
                      <div className="table-container">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {refinedColumnHeaders.map((key, index) => (
                                <th key={index} className={`px-6 py-3 text-left text-xm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'cleaned_content'.includes(key) ? 'highlight-header' : ''}`}>
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {refinedFileData.slice(0, 20).map((row, rowIndex) => (
  <tr key={rowIndex} className="hover:bg-gray-100">
    {refinedColumnHeaders.map((header, i) => (
      <td 
        key={i} 
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
          ${'cleaned_content'.includes(header) ? 'highlight-column' : ''}`}
      >
        {row[i] !== undefined ? 
          (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
          ''}
      </td>
    ))}
  </tr>
))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {showLabelingSection && (
          <section className="w-full bg-white p-8 rounded-lg shadow-lg mb-6 slide-down">
            <h2 className="text-xl font-bold text-indigo-600 mb-4">3. 레이블링 옵션</h2>
            <div className="flex flex-col gap-6">
              {showSummarySection && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner slide-down">
                  <h3 className="text-md font-semibold text-indigo-500 mb-2">3.1 본문 300자 이내로 요약하기</h3>
                  <p className="text-sm text-gray-600 mt-1">본문 내용을 200~300자 이내로 요약하여 저장합니다.</p>
                  <p className="text-sm text-gray-600 mt-1">데이터는 <span className="text-md text-red-600">'cleaned_content'</span> 컬럼에서 추출하며, 요약된 데이터는 <span className="text-md text-red-600">'summary'</span> 컬럼에 저장됩니다.</p>
                  {isCompleted && (
                    <button 
                      onClick={handleSummaryClick}
                      className="mt-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none mx-auto block"
                    >
                      요약하기
                    </button>
                  )}
                  {isSummaryLoading && (
                    <div className="flex items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                      <div className="loader mb-4"></div>
                      <p className="text-lg font-bold text-gray-700">요약 중...</p>
                    </div>
                  )}
                  {isSummaryCompleted && (
                    <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                      <p className="text-4xl text-green-600">✔ Clear</p>
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => setIsSummaryPreviewVisible(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          Summary 데이터 미리보기
                        </button>
                        <a 
                          href="/3. 본문 내용 요약 후.xlsx"
                          download
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                  {isSummaryPreviewVisible && summaryFileData && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <button 
                          onClick={() => setIsSummaryPreviewVisible(false)}
                          className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          닫기
                        </button>
                        <h3 className="text-lg font-semibold text-gray-700 mt-2">요약된 데이터 미리보기</h3>
                        <div className="table-container">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {summaryColumnHeaders.map((key, index) => (
                                  <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'Summary'.includes(key) ? 'highlight-header' : ''}`}>
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {summaryFileData.slice(0, 20).map((row, rowIndex) => (
  <tr key={rowIndex} className="hover:bg-gray-100">
    {summaryColumnHeaders.map((header, i) => (
      <td 
        key={i} 
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
          ${'Summary'.includes(header) ? 'highlight-column' : ''}`}
      >
        {row[i] !== undefined ? 
          (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
          ''}
      </td>
    ))}
  </tr>
))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showKeywordsSection && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner slide-down">
                  <h3 className="text-md font-semibold text-indigo-500 mb-2">3.2 본문에서 가장 관련높은 키워드 5개 추출하기</h3>
                  <p className="text-sm text-gray-600 mt-1">본문 내용에서 가장 관련높은 Kewords 5개를 추출하여 저장합합니다.</p>
                  <p className="text-sm text-gray-600 mt-1">데이터는 <span className="text-md text-red-600">'summary'</span> 컬럼에서 추출하며, 추출한 데이터는 <span className="text-md text-red-600">'keywords'</span> 컬럼에 저장됩니다.</p>
                  {isSummaryCompleted && (
                    <button 
                      onClick={handleKeywordsClick}
                      className="mt-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none mx-auto block"
                    >
                      추출하기
                    </button>
                  )}
                  {isKeywordsLoading && (
                    <div className="flex items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                      <div className="loader mb-4"></div>
                      <p className="text-lg font-bold text-gray-700">추출 중...</p>
                    </div>
                  )}
                  {isKeywordsCompleted && (
                    <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                      <p className="text-4xl text-green-600">✔ Clear</p>
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => setIsKeywordsPreviewVisible(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          Keywords 데이터 미리보기
                        </button>
                        <a 
                          href="/4. 본문 키워드 추출 후.xlsx"
                          download
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                  {isKeywordsPreviewVisible && keywordsFileData && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <button 
                          onClick={() => setIsKeywordsPreviewVisible(false)}
                          className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                        >
                          닫기
                        </button>
                        <h3 className="text-lg font-semibold text-gray-700 mt-2">Keywords 데이터 미리보기</h3>
                        <div className="table-container">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {keywordsColumnHeaders.map((key, index) => (
                                  <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'Keywords'.includes(key) ? 'highlight-header' : ''}`}>
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {keywordsFileData.slice(0, 20).map((row, rowIndex) => (
  <tr key={rowIndex} className="hover:bg-gray-100">
    {keywordsColumnHeaders.map((header, i) => (
      <td 
        key={i} 
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
          ${'Keywords'.includes(header) ? 'highlight-column' : ''}`}
      >
        {row[i] !== undefined ? 
          (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
          ''}
      </td>
    ))}
  </tr>
))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showVectorSection && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner slide-down">
                  <h3 className="text-md font-semibold text-indigo-500 mb-2">3.3 전공, 학부, 학년, 단원 벡터화 후 레이블링</h3>
                  <p className="text-sm text-gray-600 mt-1">본문 내용을 벡터화하여, 코사인유사도 및 GPT-Prompting으로 지정해둔 학과 단원 리스트에서 찾아서 1:1 매칭</p>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <button 
                      onClick={() => setIsMajorsPreviewVisible(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none"
                    >
                      학부 리스트 미리보기
                    </button>
                    <button 
                      onClick={() => setIsUnitsPreviewVisible(true)}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none"
                    >
                      단원 리스트 미리보기
                    </button>
                  </div>
                  <br/>
                  <p className="text-sm text-gray-600 mt-1">유사도가 가장 높은 순위부터 3개를 추출하여 저장합니다.</p>
                  <p className="text-sm text-gray-600 mt-1"><span className="text-md text-red-600">(전공[Major], 학부[Major_Category])</span> - 3쌍</p>
                  <p className="text-sm text-gray-600 mt-1"><span className="text-md text-red-600">(학과[Subject], 단원[Unit], 학년[School], 학년범위[Grade])</span> - 3쌍</p>
                  <br/>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-4">
                    <h3 className="text-md font-semibold text-indigo-500 mb-2">범위 지정 및 레이블링 옵션</h3>
                    <div className="flex flex-col items-center gap-4">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          value="Elemental" 
                          checked={selectedOptions.includes('Elemental')}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedOptions(prev =>
                              prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
                            );
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">초등 (Elemental)</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          value="Middle" 
                          checked={selectedOptions.includes('Middle')}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedOptions(prev =>
                              prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
                            );
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">중등 (Middle)</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          value="High" 
                          checked={selectedOptions.includes('High')}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedOptions(prev =>
                              prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
                            );
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">고등 (High)</span>
                      </label>
                    </div>
                    {selectedOptions.length > 0 && (
                      <div className="w-full bg-gray-50 p-2 border rounded-lg mt-4">
                        <h3 className="text-sm font-semibold text-gray-500">선택한 컬옵션:</h3>
                        <ul className="list-disc pl-5">
                          {selectedOptions.map((option, index) => (
                            <li key={index} className="text-sm text-gray-700">{option}</li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => {
                            setIsLabelingReady(true);
                            setIsLabelingCompleted(false);
                          }}
                          className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 focus:outline-none"
                        >
                          범위 지정 완료
                        </button>
                      </div>
                    )}
                    {isLabelingReady && !isLabelingCompleted && (
                      <button 
                        onClick={handleLabelingStart}
                        className="mt-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none mx-auto block"
                      >
                        LABELING START
                      </button>
                    )}
                    {isLabelingLoading && (
                      <div className="flex items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                        <div className="loader mb-4"></div>
                        <p className="text-lg font-bold text-gray-700">Labeling 중...</p>
                      </div>
                    )}
                    {isLabelingCompleted && (
                      <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 rounded-lg">
                        <p className="text-4xl text-green-600">✔ Clear</p>
                        <p className="text-md text-gray-700 mt-2 text-center"><span className="text-md text-red-600">(전공[Major], 학부[Major_Category])</span>와</p>
                        <p className="text-md text-gray-700 mt-2 text-center"><span className="text-md text-red-600">(학과[Subject], 단원[Unit], 학년[School], 학년범위[Grade])</span>이</p>
                        <p className="text-md text-gray-700 mt-2 text-center">3쌍씩 각각의 컬럼으로 저장되었습니다.</p>
                        <div className="flex gap-4 mt-4">
                          <button 
                            onClick={() => setIsFinalPreviewVisible(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                          >
                            최종파일 미리보기
                          </button>
                          <a 
                            href="/5. 전공계열 추출 후.xlsx"
                            download
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="flex gap-4">
          <div>
            {fileData && fileData
              .filter(item => item['Column1'] === selectedOption)
              .map((item, index) => (
                <div 
                  key={index} 
                  className="border p-2 bg-white hover:bg-gray-100"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {JSON.stringify(item)}
                </div>
              ))}
            {hoveredItem && (
              <div className="absolute bg-gray-200 p-2 border">
                {JSON.stringify(hoveredItem)}
              </div>
            )}
          </div>
        </div>
      </main>

      {isPreviewVisible && fileData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">엑셀 데이터 미리보기</h3>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columnHeaders.map((key, index) => (
                      <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${['cleaned_content', 'summary', 'keywords', 'Major_Category_1', 'Major_Category_2', 'Major_Category_3', 'Grade_1', 'Grade_2', 'Grade_3'].includes(key) ? 'highlight-header' : ''}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileData.slice(0, 20).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      {columnHeaders.map((header, i) => (
                        <td key={i} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 ${header === 'cleaned_content' ? 'highlight-column' : ''}`}>
                          {item[i] !== undefined ? (String(item[i]).length > 100 ? `${String(item[i]).slice(0, 100)}...` : item[i]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isRefinedPreviewVisible && refinedFileData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsRefinedPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">정제된 데이터 미리보기</h3>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {refinedColumnHeaders.map((key, index) => (
                      <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'cleaned_content'.includes(key) ? 'highlight-header' : ''}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {refinedFileData.slice(0, 20).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {refinedColumnHeaders.map((header, i) => (
                        <td 
                          key={i} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
                            ${'cleaned_content'.includes(header) ? 'highlight-column' : ''}`}
                        >
                          {row[i] !== undefined ? 
                            (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
                            ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isSummaryPreviewVisible && summaryFileData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsSummaryPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">요약된 데이터 미리보기</h3>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {summaryColumnHeaders.map((key, index) => (
                      <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'Summary'.includes(key) ? 'highlight-header' : ''}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summaryFileData.slice(0, 20).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {summaryColumnHeaders.map((header, i) => (
                        <td 
                          key={i} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
                            ${'Summary'.includes(header) ? 'highlight-column' : ''}`}
                        >
                          {row[i] !== undefined ? 
                            (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
                            ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isKeywordsPreviewVisible && keywordsFileData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsKeywordsPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">Keywords 데이터 미리보기</h3>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {keywordsColumnHeaders.map((key, index) => (
                      <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${'Keywords'.includes(key) ? 'highlight-header' : ''}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywordsFileData.slice(0, 20).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {keywordsColumnHeaders.map((header, i) => (
                        <td 
                          key={i} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
                            ${'Keywords'.includes(header) ? 'highlight-column' : ''}`}
                        >
                          {row[i] !== undefined ? 
                            (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
                            ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isFinalPreviewVisible && finalFileData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsFinalPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">최종파일 미리보기</h3>
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {finalColumnHeaders.map((key, index) => (
                      <th key={index} className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${['Major_Category_1', 'Major_1', 'Major_2', 'Major_3', 'Major_Category_2', 'Major_Category_3', 'Subject_1', 'Subject_2', 'Subject_3', 'Unit_1', 'Unit_2', 'Unit_3', 'School_1', 'School_2', 'School_3', 'Grade_1', 'Grade_2', 'Grade_3'].includes(key) ? 'highlight-header' : ''}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {finalFileData.slice(0, 20).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {finalColumnHeaders.map((header, i) => (
                        <td 
                          key={i} 
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 
                            ${['Major_Category_1', 'Major_1', 'Major_2', 'Major_3', 'Major_Category_2', 'Major_Category_3', 'Subject_1', 'Subject_2', 'Subject_3', 'Unit_1', 'Unit_2', 'Unit_3', 'School_1', 'School_2', 'School_3', 'Grade_1', 'Grade_2', 'Grade_3'].includes(header) ? 'highlight-column' : ''}`}
                        >
                          {row[i] !== undefined ? 
                            (String(row[i]).length > 100 ? `${String(row[i]).slice(0, 100)}...` : row[i]) : 
                            ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isMajorsPreviewVisible && majorsList && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsMajorsPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">학부 리스트 미리보기</h3>
            <pre className="text-sm text-gray-700 w-full">
              {JSON.stringify(majorsList, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {isUnitsPreviewVisible && schoolSubjectUnits && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsUnitsPreviewVisible(false)}
              className="close-button absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              닫기
            </button>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">단원 리스트 미리보기</h3>
            <pre className="text-sm text-gray-700 w-full">
              {JSON.stringify(schoolSubjectUnits, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
