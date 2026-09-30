import { useIonViewWillEnter } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { ControlledInput } from '@/components/form';
import { AppButton, AppPage, PageBody, PageHeader } from '@/components/ui';
import { useUpdateMe } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import type { EditProfileValues } from '@/lib/schemas/auth';
import { editProfileSchema } from '@/lib/schemas/auth';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

/** Sign-up stores a single-word name as "Ada" + "-"; show that as no surname. */
const surname = (v?: string) => (v && v !== '-' ? v : '');

const EditProfilePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const showToast = useUiStore((s) => s.showToast);
  const updateMe = useUpdateMe();

  const current = (): EditProfileValues => ({
    firstName: user?.firstName ?? '',
    lastName: surname(user?.lastName),
    phoneNumber: user?.phoneNumber ?? '',
  });

  const { control, handleSubmit, reset } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: current(),
    mode: 'onTouched',
  });

  // The page stays mounted in the nav stack, so reload the saved values each visit.
  useIonViewWillEnter(() => reset(current()));

  const onSubmit = async (values: EditProfileValues) => {
    try {
      await updateMe.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || '-',
        phoneNumber: values.phoneNumber.replace(/\s/g, ''),
      });
      showToast('Profile updated.', 'success');
      history.goBack();
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not save your changes. Please try again.'), 'danger');
    }
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Edit profile" />
      </div>

      <PageBody pb={22}>
        <ControlledInput control={control} name="firstName" label="First name" style={{ marginBottom: 15 }} />
        <ControlledInput control={control} name="lastName" label="Last name" style={{ marginBottom: 15 }} />
        <ControlledInput control={control} name="phoneNumber" label="Phone number" type="tel" placeholder="0803 123 4567" style={{ marginBottom: 15 }} />

        <p style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>
          Your email ({user?.email}) can't be changed here.
        </p>

        <AppButton
          onClick={handleSubmit(onSubmit, () => showToast('Please fix the highlighted fields.', 'warning'))}
          loading={updateMe.isPending}
          loadingLabel="Saving…"
        >
          Save changes
        </AppButton>
      </PageBody>
    </AppPage>
  );
};

export default EditProfilePage;
