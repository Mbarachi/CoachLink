import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { AppInput } from '@/components/ui';

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

/** AppInput bound to a react-hook-form field, surfacing that field's error. */
function ControlledInput<T extends FieldValues>({
  control, name, label, placeholder, type, labelStyle, style,
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppInput
          label={label}
          placeholder={placeholder}
          type={type}
          value={field.value ?? ''}
          onChange={field.onChange}
          error={fieldState.error?.message}
          labelStyle={labelStyle}
          style={style}
        />
      )}
    />
  );
}

export default ControlledInput;
