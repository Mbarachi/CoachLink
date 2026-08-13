import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { PasswordInput } from '@/components/ui';

interface ControlledPasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  /**
   * Suppresses the inline error — use where a live requirements checklist
   * already tells the user what's outstanding.
   */
  hideError?: boolean;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

function ControlledPasswordInput<T extends FieldValues>({
  control, name, label, placeholder, hideError, labelStyle, style,
}: ControlledPasswordInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PasswordInput
          label={label}
          placeholder={placeholder}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={hideError ? undefined : fieldState.error?.message}
          labelStyle={labelStyle}
          style={style}
        />
      )}
    />
  );
}

export default ControlledPasswordInput;
