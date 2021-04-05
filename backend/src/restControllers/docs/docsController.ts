import { Controller, Get, Path, Route } from 'tsoa';
import { DocManifest } from '../../common/DocManifest';
import { getDoc } from '../../docs/docsService';
import { hasValue } from '../../common/utils/hasValue';

@Route('docs')
export class DocsController extends Controller {
  /**
   * Returns the doc manifest that has the given id.
   */
  @Get('{id}')
  public async check(@Path() id: string): Promise<DocManifest> {
    const doc = getDoc(id);

    if (!hasValue(doc)) {
      throw new Error(`No doc found with id ${id}`);
    }

    return doc;
  }
}
