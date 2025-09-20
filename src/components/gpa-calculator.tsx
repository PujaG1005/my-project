
"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { FileUp, Search, Download, Trophy, TrendingDown, Users, Calculator, ChevronLeft, ChevronRight, User, Link as LinkIcon, X, Info, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/data/mock-data';
import ResultsTable from './results-table';
import MarksheetDialog from './marksheet-dialog';
import SingleStudentCalculator from './single-student-calculator';
import { Separator } from '@/components/ui/separator';
import { processExcelFile } from '@/actions/process-excel-action';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { ProcessExcelFileOutput } from '@/data/schemas';
import { downloadReport } from '@/actions/download-report-action';
import { downloadSampleExcel } from '@/actions/download-sample-excel-action';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

type TabValue = 'all' | 'top10' | 'bottom10';
const tabValues: TabValue[] = ['all', 'top10', 'bottom10'];
const regulationYears = ['2023-2025'];

export default function GpaCalculator() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileLink, setFileLink] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileLink('');
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be processed.`,
      });
    }
  };

  const handleCalculate = async () => {
    if (!selectedFile && !fileLink) {
      toast({
        variant: "destructive",
        title: "No File or Link",
        description: "Please select a file or provide a link to an Excel sheet.",
      });
      return;
    }
    
    if (!selectedRegulation) {
        toast({
            variant: "destructive",
            title: "No Regulation Selected",
            description: "Please select a regulation to calculate.",
        });
        return;
    }

    if (!selectedSemester) {
        toast({
            variant: "destructive",
            title: "No Semester Selected",
            description: "Please select which semester's data to process.",
        });
        return;
    }

    setIsLoading(true);

    try {
      let data: ProcessExcelFileOutput;
      const semester = parseInt(selectedSemester, 10);
      const regulation = parseInt(selectedRegulation, 10);
      
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        data = await new Promise<ProcessExcelFileOutput>((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(',')[1];
              const result = await processExcelFile({ fileContent: base64, fileType: selectedFile.type, semester, regulation });
              resolve(result);
            } catch (e) {
              reject(e);
            }
          };
          reader.onerror = (error) => reject(error);
        });
      } else {
        // Basic validation for URL
        if (!fileLink.startsWith('http')) {
            throw new Error("Invalid URL provided. Please provide a direct link to an Excel file.");
        }
        data = await processExcelFile({ fileUrl: fileLink, semester, regulation });
      }

      if (data.error) {
        throw new Error(data.error);
      }
      if (data.students) {
        setStudents(data.students);
      }
      setIsCalculated(true);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Calculation Failed",
        description: error.message || "An error occurred while processing the data.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);
    toast({
      title: "Download Started",
      description: "Your report is being generated and will download shortly.",
    });

    try {
      const { fileContent, error } = await downloadReport(students);

      if (error) {
        throw new Error(error);
      }

      if (fileContent) {
        const blob = new Blob([Buffer.from(fileContent, 'base64')], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'gpa_cgpa_report.xlsx');
      }

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message || "Could not generate the report.",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadSample = async () => {
    if (!selectedRegulation || !selectedSemester) {
        toast({
            variant: "destructive",
            title: "Selection Incomplete",
            description: "Please select a regulation and semester before downloading a sample.",
        });
        return;
    }
      
    setIsDownloadingSample(true);
     toast({
      title: "Generating Sample",
      description: "The sample Excel template will download shortly.",
    });
    try {
      const regulation = parseInt(selectedRegulation, 10);
      const semester = parseInt(selectedSemester, 10);

      const { fileContent, error } = await downloadSampleExcel({ regulation, semester });
      if (error) throw new Error(error);
      if (fileContent) {
        const blob = new Blob([Buffer.from(fileContent, 'base64')], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `gpa_sample_reg${regulation}_sem${semester}.xlsx`);
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message || "Could not generate the sample file.",
      });
    } finally {
      setIsDownloadingSample(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setFileLink('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const sortedStudents = useMemo(() => {
    const studentsWithCgpa = students.filter(s => s.cgpa !== undefined && s.cgpa !== null);
    return [...studentsWithCgpa].sort((a, b) => (b.cgpa ?? 0) - (a.cgpa ?? 0));
  }, [students]);

  const top10Students = useMemo(() => sortedStudents.slice(0, 10), [sortedStudents]);
  
  const bottom10Students = useMemo(() => {
     const studentsWithCgpa = students.filter(s => s.cgpa !== undefined && s.cgpa !== null);
    return [...studentsWithCgpa].sort((a, b) => (a.cgpa ?? 0) - (b.cgpa ?? 0)).slice(0, 10)
  }, [students]);

  const studentsToDisplay = useMemo(() => {
    const sourceStudents = {
      all: students,
      top10: top10Students,
      bottom10: bottom10Students,
    }[activeTab];

    if (!searchTerm) {
      return sourceStudents;
    }

    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, top10Students, bottom10Students, activeTab, searchTerm]);

  const maxSemesters = useMemo(() => {
    if (students.length === 0) return 0;
    // Find the maximum semester number present across all students' semester arrays
    return students.reduce((max, student) => {
        const studentMax = student.semesters.reduce((sMax, sem) => Math.max(sMax, sem.semester), 0);
        return Math.max(max, studentMax);
    }, 0);
  }, [students]);

  const handleTabNavigation = (direction: 'prev' | 'next') => {
    const currentIndex = tabValues.indexOf(activeTab);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % tabValues.length;
    } else {
      nextIndex = (currentIndex - 1 + tabValues.length) % tabValues.length;
    }
    setActiveTab(tabValues[nextIndex]);
  };
  
  const renderUploadCard = () => (
    <Card className="w-full shadow-lg animate-fade-in">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <FileUp className="text-primary" />
            Upload File
            </CardTitle>
            <CardDescription>
            Select regulation and the highest semester to calculate CGPA for, then upload the Excel sheet.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="regulation-select">Regulation</Label>
                    <Select onValueChange={(value) => setSelectedRegulation(value.split('-')[0])} value={selectedRegulation ? `${selectedRegulation}-${parseInt(selectedRegulation, 10) + 2}` : undefined}>
                        <SelectTrigger id="regulation-select">
                            <SelectValue placeholder="Select a regulation" />
                        </SelectTrigger>
                        <SelectContent>
                            {regulationYears.map(year => (
                                <SelectItem key={year} value={year}>Regulation {year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semester-select">Calculate CGPA up to</Label>
                    <Select onValueChange={setSelectedSemester} value={selectedSemester ?? undefined}>
                        <SelectTrigger id="semester-select">
                            <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => i + 1).map(sem => (
                                <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-background/50">
              <FileUp className="h-12 w-12 text-muted-foreground" />
              {selectedFile ? (
                  <div className='flex items-center gap-2 mt-2'>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <Button variant="ghost" size="icon" onClick={clearSelection}><X className='h-4 w-4'/></Button>
                  </div>
              ) : (
                  <>
                      <p className="mt-2 text-sm text-muted-foreground">
                          Drag & drop your Excel file here or
                      </p>
                      <Input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileSelect}
                          accept=".xlsx, .xls"
                      />
                      <Button variant="link" className="text-primary" onClick={handleBrowseClick}>
                          browse files
                      </Button>
                  </>
              )}
              </div>
              
              <div className="relative w-full flex items-center">
                  <Separator /> <span className='px-2 text-sm text-muted-foreground'>OR</span> <Separator />
              </div>

              <div className="relative w-full">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Paste Excel file link..." 
                      className="pl-9"
                      value={fileLink}
                      onChange={(e) => {
                          setFileLink(e.target.value);
                          setSelectedFile(null);
                      }} 
                  />
              </div>

              <Button onClick={handleCalculate} disabled={isLoading || !selectedSemester || !selectedRegulation} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Calculator className="mr-2 h-5 w-5" />
                {isLoading ? 'Processing...' : `Calculate CGPA for ${selectedRegulation || ''} up to Sem ${selectedSemester || ''}`}
              </Button>
            </div>
             <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Download Sample Excel Template</AlertTitle>
                <AlertDescription>
                   <p className="mb-2">
                        Select a regulation and semester to download a pre-filled Excel template. You just need to enter student Reg No, Name, and Marks.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleDownloadSample} disabled={isDownloadingSample || !selectedRegulation || !selectedSemester}>
                        <FileText className="mr-2 h-4 w-4" />
                        {isDownloadingSample ? 'Downloading...' : `Download Template`}
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
  );

  const renderResultsCard = () => (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle>Results Dashboard</CardTitle>
        <CardDescription>
          View, search, and analyze GPA/CGPA for all students.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or reg no..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ml-auto flex gap-2">
            <Button onClick={() => setIsCalculated(false)} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleTabNavigation('prev')}>
              <ChevronLeft />
            </Button>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all"><Users className="mr-2 h-4 w-4" />All Students</TabsTrigger>
              <TabsTrigger value="top10"><Trophy className="mr-2 h-4 w-4" />Top 10</TabsTrigger>
              <TabsTrigger value="bottom10"><TrendingDown className="mr-2 h-4 w-4" />Bottom 10</TabsTrigger>
            </TabsList>
             <Button variant="ghost" size="icon" onClick={() => handleTabNavigation('next')}>
              <ChevronRight />
            </Button>
          </div>
          <TabsContent value="all">
            <ResultsTable students={studentsToDisplay} maxSemesters={maxSemesters} onViewMarksheet={setSelectedStudent} />
          </TabsContent>
          <TabsContent value="top10">
            <ResultsTable students={studentsToDisplay} maxSemesters={maxSemesters} onViewMarksheet={setSelectedStudent} />
          </TabsContent>
          <TabsContent value="bottom10">
             <ResultsTable students={studentsToDisplay} maxSemesters={maxSemesters} onViewMarksheet={setSelectedStudent} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderSkeleton = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
        <div className="pt-4">
          <Skeleton className="h-12 w-full" />
          <p className="text-center text-primary animate-pulse mt-2">Processing file, please wait...</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) return renderSkeleton();
    if (isCalculated) return renderResultsCard();
    return (
        <Tabs defaultValue="bulk" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bulk"><Users className="mr-2 h-4 w-4" />Bulk Upload</TabsTrigger>
                <TabsTrigger value="single"><User className="mr-2 h-4 w-4" />Single Student</TabsTrigger>
            </TabsList>
            <TabsContent value="bulk" className="pt-4">
                {renderUploadCard()}
            </TabsContent>
            <TabsContent value="single" className="pt-4">
                <SingleStudentCalculator />
            </TabsContent>
        </Tabs>
    )
  }
  
  if (!isClient) {
    return renderSkeleton();
  }

  return (
    <>
      {renderContent()}
      <MarksheetDialog student={selectedStudent} open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)} />
    </>
  );
}
