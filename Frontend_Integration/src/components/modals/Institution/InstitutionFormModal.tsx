import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { institutionSchema } from '../../../schemas/institutionSchema';
import { BasicDetailsFields } from '../../screens/Institution/BasicDetailsFields';
import { ContactDetailsFields } from '../../screens/Institution/ContactDetailsFields';
import { COEDetailsFields } from '../../screens/Institution/COEDetailsFields';

interface Props {
    isOpen: boolean;
    mode: 'view' | 'edit';
    initialData?: any;
    onClose: () => void;
}

export const InstitutionFormModal = ({ isOpen, mode, initialData, onClose }: Props) => {
    const methods = useForm({
        resolver: zodResolver(institutionSchema),
        defaultValues: initialData || {}
    });

    if (!isOpen) return null;
    const isReadOnly = mode === 'view';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{mode === 'edit' ? 'Edit' : 'View'} Institution Details</h2>
                    <button onClick={onClose} className="text-gray-500 text-xl">&times;</button>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit((data) => console.log('Saved:', data))}>
                        {/* The fieldset instantly locks all inputs if in view mode */}
                        <fieldset disabled={isReadOnly} className="space-y-6">
                            <section>
                                <h3 className="font-semibold mb-3 border-b pb-1">Basic Details</h3>
                                <BasicDetailsFields />
                            </section>
                            <section>
                                <h3 className="font-semibold mb-3 border-b pb-1">Contact Information</h3>
                                <ContactDetailsFields />
                            </section>
                            <section>
                                <h3 className="font-semibold mb-3 border-b pb-1">COE Details</h3>
                                <COEDetailsFields />
                            </section>
                        </fieldset>

                        <div className="mt-6 flex justify-end">
                            {!isReadOnly && (
                                <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-lg font-medium">Save</button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};