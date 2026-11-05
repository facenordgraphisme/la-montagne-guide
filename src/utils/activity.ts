import { toPlainText } from '@/utils/richText';

// Card summary in English, null when the activity has no English text
export function activitySummaryEn(activity: any): string | null {
  if (activity?.descriptionEn?.length) return toPlainText(activity.descriptionEn);
  return activity?.introEn?.trim() || null;
}

export function sortActivities(activities: any[], activitiesOrder?: { _id: string }[]) {
  if (!activities) return [];
  if (!activitiesOrder || activitiesOrder.length === 0) {
    return [...activities].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }
  
  const orderMap = new Map(activitiesOrder.map((item, index) => [item._id, index]));
  
  return [...activities].sort((a, b) => {
    const aOrder = orderMap.has(a._id) ? orderMap.get(a._id)! : Infinity;
    const bOrder = orderMap.has(b._id) ? orderMap.get(b._id)! : Infinity;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return (a.title || '').localeCompare(b.title || '');
  });
}
