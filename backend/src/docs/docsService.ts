import _ from 'lodash';

import { DocManifest } from '../common/DocManifest';
import { docManifests } from './docManifests';

export const getDoc = (id: string): DocManifest | null =>
  _.find(docManifests, (doc) => doc.id === id) ?? null;
