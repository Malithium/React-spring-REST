module.exports = function follow(api, rootPath, token, relArray) {
    var root = api({
        method: 'GET',
        path: rootPath,
        headers: {'Accept': 'application/hal+json', 'Authorization': 'Bearer ' + token}
    });

    return relArray.reduce(function(root, arrayItem) {
        var rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
        return traverseNext(root, rel, token, arrayItem);
    }, root);

    function traverseNext (root, rel, token, arrayItem) {
        return root.then(function (response) {
            if (hasEmbeddedRel(response.entity, rel)) {
                return response.entity._embedded[rel];
            }

            if(!response.entity._links) {
                return [];
            }

            if (typeof arrayItem === 'string') {
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href,
                    headers: {'Accept': 'application/hal+json', 'Authorization': 'Bearer ' + token}
                });
            } else {
                return api({
                    method: 'GET',
                    path: response.entity._links[rel].href,
                    params: arrayItem.params,
                    headers: {'Accept': 'application/hal+json', 'Authorization': 'Bearer ' + token},
                });
            }
        });
    }

    function hasEmbeddedRel (entity, rel) {
        return entity._embedded && entity._embedded.hasOwnProperty(rel);
    }
};