"use client"

import { useState } from "react"

interface DoctorDocuments {
  profilePhoto?: string | null
  licenseDocument?: string | null
  degreeCertificates?: string[]
}

interface DoctorDocumentsSectionProps {
  documents: DoctorDocuments
}

export default function DoctorDocumentsSection({ documents }: DoctorDocumentsSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Documents & Certificates
      </h2>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Photo
          </label>
          {documents.profilePhoto ? (
            <div className="flex items-start gap-4">
              <img
                src={documents.profilePhoto}
                alt="Profile Photo"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setSelectedImage(documents.profilePhoto || null)}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Profile photo uploaded</p>
                <a
                  href={documents.profilePhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  View Full Size
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No profile photo uploaded</p>
          )}
        </div>

        {/* License Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            License Document
          </label>
          {documents.licenseDocument ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📄</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">License Document</p>
                  <p className="text-xs text-gray-500">Uploaded</p>
                </div>
                <a
                  href={documents.licenseDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Document
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No license document uploaded</p>
          )}
        </div>

        {/* Degree Certificates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Degree Certificates ({documents.degreeCertificates?.length || 0})
          </label>
          {documents.degreeCertificates && documents.degreeCertificates.length > 0 ? (
            <div className="space-y-3">
              {documents.degreeCertificates.map((cert, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎓</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Certificate #{index + 1}
                      </p>
                      <p className="text-xs text-gray-500">Degree certificate</p>
                    </div>
                    <a
                      href={cert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No degree certificates uploaded</p>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

