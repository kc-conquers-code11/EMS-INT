import { useSearchParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { institutionSchema } from '../../schemas/institutionSchema';
import { InstitutionTabs } from '../../components/screens/Institution/InstitutionTabs';
import { BasicDetailsFields } from '../../components/screens/Institution/BasicDetailsFields';
import { ContactDetailsFields } from '../../components/screens/Institution/ContactDetailsFields';
import { COEDetailsFields } from '../../components/screens/Institution/COEDetailsFields';
import { InstitutionListView } from '../../components/screens/Institution/InstitutionListView';
import { institutionAPI, coeAPI } from '../../services/api';

import { useState } from 'react';

export const AddInstitutionPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = parseInt(searchParams.get('tab') || '0');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const setActiveTab = (index: number) => {
        setSearchParams({ tab: index.toString() });
    };

    const methods = useForm({
        resolver: zodResolver(institutionSchema),
        mode: 'onChange',
        defaultValues: {
            // Basic Details
            institutionName: '',
            institutionCode: '',
            institutionType: 'Autonomous',
            affiliatedUniversity: '',
            establishmentYear: '',
            logoUrl: '',
            courses: { postgraduate: false, undergraduate: false, phd: false, other: [] },
            accreditation: { nba: false, naac: false, aicte: false, other: [] },
            // Contact Details
            road: '',
            city: 'Mumbai Suburban',
            state: 'Maharashtra',
            pincode: '',
            officialEmail: '',
            websiteUrl: '',
            phoneNumber: '',
            alternatePhoneNumber: '',
            // COE Details
            coeName: '',
            coeEmployeeId: '',
            coeEmail: '',
            coeContactNumber: '',
            coeQualification: '',
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Step 1: Map frontend camelCase fields to backend snake_case fields
            const institutionPayload = {
                name: data.institutionName,
                institution_code: data.institutionCode || undefined,
                establishment_year: data.establishmentYear || undefined,
                institution_type: data.institutionType || undefined,
                affiliated_university: data.affiliatedUniversity || undefined,
                logo: data.logoUrl || undefined,
                road: data.road || undefined,
                city: data.city || undefined,
                state: data.state || undefined,
                pincode: data.pincode || undefined,
                phone_number: data.phoneNumber || undefined,
                alternate_phone_number: data.alternatePhoneNumber || undefined,
                official_email: data.officialEmail || undefined,
                website_url: data.websiteUrl || undefined,
                accreditation: data.accreditation || undefined,
                courses: data.courses || undefined,
                status: true,
            };

            // Step 2: Create the institution
            const institutionResponse = await institutionAPI.create(institutionPayload);

            if (!institutionResponse.data.success || !institutionResponse.data.data) {
                throw new Error(institutionResponse.data.message || 'Failed to create institution');
            }

            const createdInstitution = institutionResponse.data.data as any;
            const institutionId = createdInstitution.institution_id;

            // Step 3: Create the COE linked to the new institution
            if (data.coeName && data.coeEmail && data.coeEmployeeId && data.coeContactNumber) {
                const coePayload = {
                    institution_id: institutionId,
                    name: data.coeName,
                    employee_id: data.coeEmployeeId,
                    email: data.coeEmail,
                    phone_number: data.coeContactNumber,
                    qualification: data.coeQualification || undefined,
                };

                await coeAPI.create(coePayload);
            }

            // Step 4: Reset form and navigate to list view
            methods.reset();
            setActiveTab(3);
        } catch (error: any) {
            console.error('Error creating institution:', error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred. Please try again.';
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        if (activeTab < 2) setActiveTab(activeTab + 1);
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Page header */}
            <div className="flex flex-col gap-[28px]">
                <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">
                    {activeTab === 3 ? 'Institution List' : 'Add Institution Details'}
                </h1>

                <InstitutionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Error Banner */}
            {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    <strong>Error:</strong> {submitError}
                </div>
            )}

            {/* Form */}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="mt-[40px] min-h-[300px]">
                        {activeTab === 0 && <BasicDetailsFields />}
                        {activeTab === 1 && <ContactDetailsFields />}
                        {activeTab === 2 && <COEDetailsFields />}
                        {activeTab === 3 && <InstitutionListView />}
                    </div>

                    {activeTab !== 3 && (
                        <div className="mt-10 flex justify-end">
                            {activeTab < 2 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-[18px] py-2.5 bg-[#0e1680] hover:bg-[#0a106e] text-white rounded-lg font-semibold text-base transition-colors shadow-sm"
                                >
                                    Next
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-[18px] py-2.5 bg-[#0e1680] hover:bg-[#0a106e] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base transition-colors shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Generate Login
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    );
};