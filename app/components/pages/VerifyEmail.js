import React, {useEffect} from 'react';

import { PageWrapper } from '../utils/PageWrapper';

export const VerifyEmail = () => {
	useEffect(() => {
		// A lot of this comes from stackoverflow, only skimmed but it seems pretty accurate
		if (location.search) location.search.substr(1).split("&").forEach(function(item) {
			var s = item.split("="),
				k = s[0],
				v = s[1] && decodeURIComponent(s[1]); //  null-coalescing / short-circuit
			if (k == 'token') {
				console.log(k)
				console.log(v)
			}
		})
	}, []);

	return (
		<PageWrapper>
			<h1>Verify Email</h1>
		</PageWrapper>
	)
}
