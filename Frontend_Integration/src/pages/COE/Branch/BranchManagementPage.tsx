import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, type BranchFormData } from '../../../schemas/COE/branchSchema';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../../../services/branch/branchApiService';
import { BranchTabs } from '../../../components/screens/COE/Branch/BranchTabs';
import { BranchForm } from '../../../components/screens/COE/Branch/BranchForm';
import { BranchListView } from '../../../components/screens/COE/Branch/BranchListView';
import { BranchSuccessModal } from '../../../components/modals/Branch/BranchSuccessModal';

export const BranchManagementPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
    getBranches()
        .then(r => {
            const list = Array.isArray(r) ? r : (r?.data ?? []);
            setBranches(list);
        })
        .catch(err => {
            console.error('Failed to fetch branches', err);
            setBranches([]);
        })
        .finally(() => setLoading(false));
}, []);

    const methods = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        mode: 'onChange',
        defaultValues: {
            branch_name: '',
            depart_id: '',
            branch_code: '',
            programm_id: '',
            total_intake: undefined,
            status: true
        }
    });

    const onSubmit = async (data: BranchFormData) => {
        try {
            await createBranch(data);
            const refreshed = await getBranches();
            setBranches(refreshed.data);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error('Failed to create branch', err);
        }
    };

    const handleUpdateBranch = (updatedBranch: any) => {
        setBranches(prev => prev.map(b => (b.branch_id === updatedBranch.branch_id ? updatedBranch : b)));
    };

    const handleDeleteBranch = async (id: string) => {
        try {
            await deleteBranch(id);
            setBranches(prev => prev.filter(b => b.branch_id !== id));
        } catch (err) {
            console.error('Failed to delete branch', err);
        }
    };

    const handleCloseModal = () => {
        setIsSuccessModalOpen(false);
        methods.reset();
        setActiveTab(1); // Switch to View tab after success
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">
                Branch Management
            </h1>

            <BranchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <FormProvider {...methods}>
                {activeTab === 0 ? (
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <BranchForm />
                    </form>
                ) : (
                    <BranchListView
                        branches={branches}
                        onUpdateBranch={handleUpdateBranch}
                        onDeleteBranch={handleDeleteBranch}
                    />
                )}
            </FormProvider>

            <BranchSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};
