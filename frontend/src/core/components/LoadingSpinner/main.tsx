import type { LoadingSpinnerProps } from './types';

export const LoadingSpinner = ({ size = 24 }: LoadingSpinnerProps) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <circle cx="12" cy="3" r="0">
        <animate
          id="svgSpinners6DotsScale0"
          attributeName="r"
          begin="0;svgSpinners6DotsScale2.end-0.5s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
      <circle cx="16.5" cy="4.21" r="0">
        <animate
          id="svgSpinners6DotsScale1"
          attributeName="r"
          begin="svgSpinners6DotsScale0.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
      <circle cx="7.5" cy="4.21" r="0">
        <animate
          id="svgSpinners6DotsScale2"
          attributeName="r"
          begin="svgSpinners6DotsScale4.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
      <circle cx="12" cy="21" r="0">
        <animate
          id="svgSpinners6DotsScale3"
          attributeName="r"
          begin="svgSpinners6DotsScale0.begin+0.3s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
      <circle cx="16.5" cy="19.79" r="0">
        <animate
          id="svgSpinners6DotsScale4"
          attributeName="r"
          begin="svgSpinners6DotsScale0.begin+0.4s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
      <circle cx="7.5" cy="19.79" r="0">
        <animate
          id="svgSpinners6DotsScale5"
          attributeName="r"
          begin="svgSpinners6DotsScale0.begin+0.5s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".27,.42,.37,.99;.53,0,.61,.73"
          values="0;2;0"
        />
      </circle>
    </svg>
  </div>
);
