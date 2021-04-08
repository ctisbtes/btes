import * as React from 'react';

interface IProps {}

const LoaderMask: React.FunctionComponent<IProps> = () => (
  <div className="progress">
    <div
      className="progress-bar progress-bar-striped progress-bar-animated h-100"
      role="progressbar"
      aria-valuenow={75}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: '75%' }}
    >
      Loading
    </div>
  </div>
);
export default LoaderMask;
