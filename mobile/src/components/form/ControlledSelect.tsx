import React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { AppSelect } from '@/components/ui';

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: readonly string[];
  label?: string;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

function ControlledSelect<T extends FieldValues>({
  control, name, options, label, labelStyle, style,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AppSelect
          label={label}
          options={options}
          value={field.value ?? ''}
          onChange={field.onChange}
          labelStyle={labelStyle}
          style={style}
        />
      )}
    />
  );
}

export default ControlledSelect;
