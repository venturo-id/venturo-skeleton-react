import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';

import { ApiKeysListView } from '../views/api-keys-list-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslate('api-keys');

  return (
    <>
      <title>{`${t('title')} - ${CONFIG.appName}`}</title>
      <ApiKeysListView />
    </>
  );
}
