const getColorOfIndex = index => {
    const colors = [
        '#E84B3A',
        '#FFC000',
        '#FC7F0C',
        '#92278F',
        '#0FBAF4',
        '#008C99',
        '#EE257C',
        '#88C87B',
        '#FA6F57',
        '#FFC000',
        '#9BBA1F',
        '#C3007C',
        '#54CA7F',
    ];

    return colors[index % colors.length];
};

export {getColorOfIndex};
