'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Loader2 } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
}

const QuantityControl: FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  maxQuantity,
  disabled = false,
  size = 'default',
  loading = false,
}) => {
  const isMaxReached = maxQuantity !== undefined && quantity >= maxQuantity;
  const isMinReached = quantity <= 1;

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button
        size={size}
        variant="outline"
        onClick={onDecrease}
        disabled={disabled || isMinReached || loading}
        aria-label="Уменьшить количество"
        className="h-7 w-7 md:h-8 md:w-8 p-0"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
        ) : (
          <Minus className="h-3 w-3 md:h-4 md:w-4" />
        )}
      </Button>

      <span className="w-8 md:w-10 text-center font-medium text-sm md:text-base">{quantity}</span>

      <Button
        size={size}
        variant="outline"
        onClick={onIncrease}
        disabled={disabled || isMaxReached || loading}
        aria-label="Увеличить количество"
        className="h-7 w-7 md:h-8 md:w-8 p-0"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
        ) : (
          <Plus className="h-3 w-3 md:h-4 md:w-4" />
        )}
      </Button>

      {maxQuantity !== undefined && (
        <span className="text-[10px] md:text-xs text-gray-500 ml-1 hidden sm:inline">
          (макс. {maxQuantity})
        </span>
      )}
    </div>
  );
};

export default QuantityControl;

