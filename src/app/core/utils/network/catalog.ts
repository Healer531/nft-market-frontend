import { environment } from '../../../../environment';
import { Filter } from '../../models/filter';

export function catalogFilterNft(filterData: Filter) {
    return fetch(`${ environment.serverUrl }/nft/filter`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify(filterData),
    }).then(handleResponse)
}

function handleResponse(response: any) {
    return response.json();
}