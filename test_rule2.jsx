import React from 'react';
function Test({item}) {
    return Array.from({length: item.rarity ?? 1}).map((_, i) => <span key={`star-${i + 1}`}>star</span>);
}
